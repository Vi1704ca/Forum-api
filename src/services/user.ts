import type { UserRepository } from '../domain/user/repository.js'
import {
    createAccessToken,
    createRefreshToken,
    verifyRefreshToken,
} from '../lib/accessToken.js'
import type { PasswordHasher, UserService } from './user.types.js'

export function createUserService(
    repository: UserRepository,
    hasher: PasswordHasher,
): UserService {
    return {
        async register(input) {
            const email = input.email.trim().toLowerCase()
            const existingUser = await repository.findByEmail(email)
            if (existingUser) {
                throw new Error('USER_ALREADY_EXISTS')
            }

            const passwordHash = await hasher.hash(input.password)
            const user = await repository.createUser({
                email,
                passwordHash,
            })
            return { id: user.id, email: user.email }
        },
        async login(input) {
            const email = input.email.trim().toLowerCase()
            const user = await repository.findByEmail(email)
            if (!user || !(await hasher.verify(input.password, user.passwordHash))) {
                throw new Error('INVALID_CREDENTIALS')
            }

            const publicUser = { id: user.id, email: user.email }
            return {
                user: publicUser,
                accessToken: createAccessToken(publicUser),
                refreshToken: createRefreshToken(publicUser),
            }
        },
        async getById(id) {
            const user = await repository.findById(id)
            return user ? { id: user.id, email: user.email } : null
        },
        async refresh(refreshToken) {
            const tokenUser = verifyRefreshToken(refreshToken)
            if (!tokenUser) {
                return null
            }

            const user = await repository.findById(tokenUser.id)
            if (!user) {
                return null
            }

            const publicUser = { id: user.id, email: user.email }
            return {
                user: publicUser,
                accessToken: createAccessToken(publicUser),
            }
        },
    }
}
