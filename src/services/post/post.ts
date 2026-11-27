import type { PostRepository } from "../../domain/post/repository.js";
import type { PostService } from "./post.types.js";

export function createPostService(postRepository: PostRepository): PostService {
	return {
		getAll: () => postRepository.getAll(),
		getById: (id) => postRepository.getById(id),
		getByAuthorId: (authorId) => postRepository.getByAuthorId(authorId),
		addPost: (post) =>
			postRepository.addPost({
				...post,
				title: post.title.trim(),
				content: post.content.trim(),
			}),
	};
}
