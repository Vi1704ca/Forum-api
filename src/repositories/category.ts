import type { Category, NewCategory } from '../domain/category/entity.js'
import type { Repository } from '../domain/category/repository.js'
import type { db } from '../prisma/db.js'

export function createCategoryRepository(database: typeof db): Repository {
    const categories = database.orm.public.Category

    async function getAll(): Promise<Category[]> {
        return categories.orderBy(category => category.id.asc()).all()
    }

    async function getById(id: number): Promise<Category | undefined> {
        return (await categories.first({ id })) ?? undefined
    }

    async function addCategory(category: NewCategory): Promise<Category> {
        return categories.create(category)
    }

    return { getAll, getById, addCategory }
}
