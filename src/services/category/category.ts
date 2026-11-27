import type { CategoryRepository } from "../../domain/category/repository.js";
import type { CategoryService } from "./category.types.js";

export function createCategoryService(
	categoryRepository: CategoryRepository,
): CategoryService {
	return {
		getAll: () => categoryRepository.getAll(),
		getById: (id) => categoryRepository.getById(id),
		addCategory: (category) =>
			categoryRepository.addCategory({ name: category.name.trim() }),
	};
}
