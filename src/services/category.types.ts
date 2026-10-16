import type { Category, NewCategory } from '../domain/category/entity.js'

export interface CategoryService {
    getAll(): Promise<Category[]>
    getById(id: number): Promise<Category | undefined>
    addCategory(category: NewCategory): Promise<Category>
}
