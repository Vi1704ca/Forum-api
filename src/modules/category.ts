import type { Database } from "../prisma/db.js";
import { createCategoryRepository } from "../repositories/category.js";
import { createCategoryService } from "../services/category/category.js";
import { createCategoryHandlers } from "../transport/handlers/category.js";
import { createCategoryRouter } from "../transport/routers/category.js";

// Збираю залежності категорій тут, щоб застосунок підключав готовий роутер.
export function createCategoryModule(database: Database) {
	const repository = createCategoryRepository(database);
	const service = createCategoryService(repository);
	const handlers = createCategoryHandlers(service);

	return createCategoryRouter(handlers);
}
