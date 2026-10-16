import type { Repository } from '../domain/category/repository.js'

type Database = typeof import('../prisma/db.js').db

export function createCategoryRepository(database: Database): Repository {
    return {
        async getAll() {
            return database.orm.public.Category
                .orderBy(category => category.id.asc())
                .all()
        },
        async getById(id) {
            return (await database.orm.public.Category.where({ id }).first()) ?? undefined
        },
        async addCategory(category) {
            return database.orm.public.Category.create(category)
        },
    }
}
