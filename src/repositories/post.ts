import type { PostRecord } from "../domain/post/entity.js";
import type { PostRepository } from "../domain/post/repository.js";
import type { Database } from "../prisma/db.js";

function postsWithRelations(database: Database) {
	return database.orm.public.Post.include("category").include(
		"author",
		(author) => author.select("id", "email"),
	);
}

export function createPostRepository(database: Database): PostRepository {
	return {
		async getAll() {
			const posts: PostRecord[] = await postsWithRelations(database)
				.orderBy((post) => post.id.asc())
				.all();
			return posts;
		},
		async getById(id) {
			const post: PostRecord | null = await postsWithRelations(database)
				.where({ id })
				.first();
			return post;
		},
		async getByAuthorId(authorId) {
			const posts: PostRecord[] = await postsWithRelations(database)
				.where({ authorId })
				.orderBy((post) => post.id.asc())
				.all();
			return posts;
		},
		async addPost(post) {
			const createdPost: PostRecord = await postsWithRelations(
				database,
			).create({
				title: post.title,
				content: post.content,
				category: (category) =>
					category.connect({ id: post.categoryId }),
				author: (author) => author.connect({ id: post.authorId }),
			});
			return createdPost;
		},
	};
}
