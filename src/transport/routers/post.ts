import { Router } from "express";
import type { PostHandlers } from "../handlers/post.js";
import type { RequestHandler } from "express";

export function createPostRouter(
	postHandlers: PostHandlers,
	requireAuth: RequestHandler,
) {
	const router = Router();

	router.get("/", postHandlers.getAll);
	router.get("/me", requireAuth, postHandlers.getOwnPosts);
	router.get("/:id", postHandlers.getById);
	router.post("/", requireAuth, postHandlers.addPost);

	return router;
}
