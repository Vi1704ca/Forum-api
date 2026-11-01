import type { UserRepository } from '../domain/user/repository.js'
import { createAccessToken } from '../lib/access-token.js'
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
                hashPassword: passwordHash,
            })
            return { id: user.id, email: user.email }
        },
        async login(input) {
            const email = input.email.trim().toLowerCase()
            const user = await repository.findByEmail(email)
            if (!user || !(await hasher.verify(input.password, user.hashPassword))) {
                throw new Error('INVALID_CREDENTIALS')
            }

            const publicUser = { id: user.id, email: user.email }
            return {
                user: publicUser,
                accessToken: createAccessToken(publicUser),
            }
        },
    }
}
