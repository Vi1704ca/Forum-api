import { randomUUID } from 'node:crypto'
import type { RefreshSessionRepository } from '../../domain/refreshSession/repository.js'
import type { UserRepository } from '../../domain/user/repository.js'
import type {
    AuthService,
    PasswordHasher,
    TokenHasher,
    TokenSigner,
    TokenVerifier,
} from './auth.types.js'

export function createAuthService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenSigner: TokenSigner,
    tokenVerifier: TokenVerifier,
    refreshSessionRepository: RefreshSessionRepository,
    tokenHasher: TokenHasher,
): AuthService {
    return {
        async register(input) {
            const email = input.email.trim().toLowerCase()
            const existingUser = await repository.findByEmail(email)
            if (existingUser) {
                throw new Error('USER_ALREADY_EXISTS')
            }

            const passwordHash = await passwordHasher.hash(input.password)
            const user = await repository.createUser({ email, passwordHash })
            return { id: user.id, email: user.email }
        },
        async login(input) {
            const email = input.email.trim().toLowerCase()
            const user = await repository.findByEmail(email)
            if (
                !user ||
                !(await passwordHasher.verify(user.passwordHash, input.password))
            ) {
                throw new Error('INVALID_CREDENTIALS')
            }

            const publicUser = { id: user.id, email: user.email }
            const refreshToken = tokenSigner.signRefreshToken(user.id)
            await refreshSessionRepository.create({
                id: randomUUID(),
                tokenHash: tokenHasher.hash(refreshToken),
                userId: user.id,
            })

            return {
                user: publicUser,
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken,
            }
        },
        async refresh(refreshToken) {
            const userId = tokenVerifier.verifyRefreshToken(refreshToken)
            const currentTokenHash = tokenHasher.hash(refreshToken)
            const session = await refreshSessionRepository.getByHash(currentTokenHash)
            if (!session || session.userId !== userId) {
                throw new Error('INVALID_REFRESH_TOKEN')
            }

            const user = await repository.findById(userId)
            if (!user) {
                throw new Error('INVALID_REFRESH_TOKEN')
            }

            const nextRefreshToken = tokenSigner.signRefreshToken(user.id)
            const rotated = await refreshSessionRepository.rotate(
                currentTokenHash,
                tokenHasher.hash(nextRefreshToken),
                randomUUID(),
            )
            if (!rotated) {
                throw new Error('INVALID_REFRESH_TOKEN')
            }

            const publicUser = { id: user.id, email: user.email }
            return {
                user: publicUser,
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: nextRefreshToken,
            }
        },
        async me(userId) {
            const user = await repository.findById(userId)
            if (!user) {
                throw new Error('UNAUTHORIZED')
            }
            return { id: user.id, email: user.email }
        },
        async logout(refreshToken) {
            if (refreshToken) {
                await refreshSessionRepository.deleteByHash(
                    tokenHasher.hash(refreshToken),
                )
            }
        },
    }
}
