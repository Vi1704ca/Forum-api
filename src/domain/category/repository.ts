import type { Category, NewCategory } from './entity.js'

export interface Repository {
    getAll(): Promise<Category[]>
    getById(id: number): Promise<Category | undefined>
    addCategory(category: NewCategory): Promise<Category>
}
