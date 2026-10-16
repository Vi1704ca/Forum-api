import type { NewPost, Post, PostFilter } from '../domain/post/entity.js'
import type { Repository } from '../domain/post/repository.js'
import type { db } from '../prisma/db.js'

export function createPostRepository(database: typeof db): Repository {
    const posts = database.orm.public.Post.include('category')

    async function getAll(filter: PostFilter): Promise<Post[]> {
        let query = posts

        if (filter.category !== undefined) {
            const category = await database.orm.public.Category
                .where({ name: filter.category })
                .first()
            if (!category) {
                return []
            }
            query = query.where({ categoryId: category.id })
        }
        if (filter.categoryId !== undefined) {
            query = query.where({ categoryId: filter.categoryId })
        }
        if (filter.take !== undefined) {
            query = query.limit(filter.take)
        }

        return query.orderBy(post => post.id.asc()).all()
    }

    async function getById(id: number): Promise<Post | undefined> {
        return (await posts.where({ id }).first()) ?? undefined
    }

    async function addPost(post: NewPost): Promise<Post | undefined> {
        const category = await database.orm.public.Category.first({ id: post.categoryId })
        if (!category) {
            return undefined
        }

        return (await database.orm.public.Post.include('category').create({
            title: post.title,
            content: post.content,
            author: post.author,
            category: category => category.connect({ id: post.categoryId }),
        })) ?? undefined
    }

    return { getAll, getById, addPost }
}
