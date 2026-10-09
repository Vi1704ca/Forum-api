import type { NewPost, Post } from '../domain/post/entity.js'
import type { Repository } from '../domain/post/repository.js'
import type { db } from '../prisma/db.js'

export function createPostRepository(database: typeof db): Repository {
    const posts = database.orm.public.Post

    async function getAll(category: string, take: number): Promise<Post[]> {
        let query = posts

        if (category) {
            query = query.where({ category })
        }
        if (take) {
            query = query.limit(take)
        }

        return query.orderBy(post => post.id.asc()).all()
    }

    async function getById(id: number): Promise<Post | undefined> {
        return (await posts.first({ id })) ?? undefined
    }

    async function addPost(post: NewPost): Promise<Post> {
        return posts.create(post)
    }

    return { getAll, getById, addPost }
}
