import type { PostService } from "../../services/post/post.types.js";
import type { CreatePostRequest } from "../dto/post/requests.js";
import type { PostResponse } from "../dto/post/responses.js";
import {
	isForeignKeyViolation,
	isMissingRelationRow,
	isUniqueConstraintViolation,
} from "../errors.js";

import type { RequestHandler } from "express";

export interface PostHandlers {
	getAll: RequestHandler<Record<string, string>, PostResponse[] | string>;
	getById: RequestHandler<{ id: string }, PostResponse | string>;
	getOwnPosts: RequestHandler<
		Record<string, string>,
		PostResponse[] | string
	>;
	addPost: RequestHandler<
		Record<string, string>,
		PostResponse | string,
		CreatePostRequest
	>;
}

function hasOnlyPostFields(body: unknown): body is Record<string, unknown> {
	return (
		body !== null &&
		typeof body === "object" &&
		!Array.isArray(body) &&
		Object.keys(body).every((field) =>
			["title", "content", "categoryId"].includes(field),
		)
	);
}

function isValidUserId(value: unknown): value is number {
	return (
		typeof value === "number" && Number.isSafeInteger(value) && value > 0
	);
}

function validateCreatePostRequest(
	body: unknown,
):
	| { valid: true; post: CreatePostRequest }
	| { valid: false; status: 400 | 422; message: string } {
	if (!hasOnlyPostFields(body)) {
		return { valid: false, status: 422, message: "Invalid post fields" };
	}

	const { title, content, categoryId } = body;
	if (
		typeof title !== "string" ||
		typeof content !== "string" ||
		!title.trim() ||
		!content.trim()
	) {
		return { valid: false, status: 422, message: "Invalid post data" };
	}

	if (
		typeof categoryId !== "number" ||
		!Number.isInteger(categoryId) ||
		categoryId <= 0
	) {
		return { valid: false, status: 400, message: "Invalid categoryId" };
	}

	return { valid: true, post: { title, content, categoryId } };
}

export function createPostHandlers(postService: PostService): PostHandlers {
	const getAll: PostHandlers["getAll"] = async (_req, res): Promise<void> => {
		try {
			const result = await postService.getAll();
			res.status(200).json(result);
		} catch (error) {
			console.error(error);
			res.status(500).json("Server's error");
		}
	};

	const getById: PostHandlers["getById"] = async (
		req,
		res,
	): Promise<void> => {
		const id = Number(req.params.id);
		if (!Number.isInteger(id) || id <= 0) {
			res.status(400).json("Invalid id");
			return;
		}

		try {
			const result = await postService.getById(id);
			if (!result) {
				res.status(404).json("There is no post with this id");
				return;
			}
			res.status(200).json(result);
		} catch (error) {
			console.error(error);
			res.status(500).json("Server's error");
		}
	};

	const getOwnPosts: PostHandlers["getOwnPosts"] = async (
		_req,
		res,
	): Promise<void> => {
		const userId = res.locals.userId;
		if (!isValidUserId(userId)) {
			res.status(401).json("Authentication required");
			return;
		}

		try {
			const posts = await postService.getByAuthorId(userId);
			res.status(200).json(posts);
		} catch (error) {
			console.error(error);
			res.status(500).json("Server's error");
		}
	};

	const addPost: PostHandlers["addPost"] = async (
		req,
		res,
	): Promise<void> => {
		const authorId = res.locals.userId;
		if (!isValidUserId(authorId)) {
			res.status(401).json("Authentication required");
			return;
		}

		const validation = validateCreatePostRequest(req.body);
		if (!validation.valid) {
			res.status(validation.status).json(validation.message);
			return;
		}

		try {
			const result = await postService.addPost({
				...validation.post,
				authorId,
			});
			if (!result) {
				res.status(404).json(
					"There is no referenced user or category with this id",
				);
				return;
			}
			res.status(201).json(result);
		} catch (error) {
			if (isUniqueConstraintViolation(error, "Post_title_key")) {
				res.status(409).json("Post with this title already exists");
				return;
			}
			if (isForeignKeyViolation(error) || isMissingRelationRow(error)) {
				res.status(404).json(
					"There is no referenced user or category with this id",
				);
				return;
			}
			console.error(error);
			res.status(500).json("Server's error");
		}
	};

	return { getAll, getById, getOwnPosts, addPost };
}
