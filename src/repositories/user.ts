import type { UserRepository } from '../domain/user/repository.js'

type Database = typeof import('../prisma/db.js').db

export function createUserRepository(database: Database): UserRepository {
    return {
        async findByEmail(email) {
            return database.orm.public.User.where({ email }).first()
        },
        async createUser(user) {
            return database.orm.public.User.create(user)
        },
    }
}
