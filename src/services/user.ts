import type { UserRepository } from '../domain/user/repository.js'
import type { PasswordHasher, UserService } from './user.types.js'

export function createUserService(repository: UserRepository, hasher: PasswordHasher): UserService {
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
    }
}
