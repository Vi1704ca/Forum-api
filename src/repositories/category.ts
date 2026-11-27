import type { CategoryRepository } from "../domain/category/repository.js";
import type { Database } from "../prisma/db.js";

export function createCategoryRepository(
	database: Database,
): CategoryRepository {
	return {
		async getAll() {
			return database.orm.public.Category.orderBy((category) =>
				category.id.asc(),
			).all();
		},
		async getById(id) {
			return (
				(await database.orm.public.Category.where({ id }).first()) ??
				undefined
			);
		},
		async addCategory(category) {
			return database.orm.public.Category.create(category);
		},
	};
}
