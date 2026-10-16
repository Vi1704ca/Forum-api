import type { Repository } from '../domain/category/repository.js'
import type { CategoryService } from './category.types.js'

export function createCategoryService(categoryRepository: Repository): CategoryService {
    return {
        getAll: () => categoryRepository.getAll(),
        getById: id => categoryRepository.getById(id),
        addCategory: category => categoryRepository.addCategory(category),
    }
}
