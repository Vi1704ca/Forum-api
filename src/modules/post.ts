import type { RequestHandler } from "express";
import type { Database } from "../prisma/db.js";
import { createPostRepository } from "../repositories/post.js";
import { createPostService } from "../services/post/post.js";
import { createPostHandlers } from "../transport/handlers/post.js";
import { createPostRouter } from "../transport/routers/post.js";

// Для дописів потрібен спільний middleware авторизації для особистої стрічки.
export function createPostModule(
	database: Database,
	requireAuth: RequestHandler,
) {
	const repository = createPostRepository(database);
	const service = createPostService(repository);
	const handlers = createPostHandlers(service);

	return createPostRouter(handlers, requireAuth);
}
