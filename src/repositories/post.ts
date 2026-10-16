import type { Repository } from '../domain/post/repository.js'

type Database = typeof import('../prisma/db.js').db

export function createPostRepository(database: Database): Repository {
    return {
        async getAll(filter) {
            let query = database.orm.public.Post
                .include('category')
                .orderBy(post => post.id.asc())

            if (filter.category !== undefined) {
                const category = await database.orm.public.Category
                    .where({ name: filter.category })
                    .first()
                if (!category) return []
                query = query.where({ categoryId: category.id })
            }
            if (filter.categoryId !== undefined) {
                query = query.where({ categoryId: filter.categoryId })
            }
            if (filter.take !== undefined) {
                return query.limit(filter.take).all()
            }
            return query.all()
        },
        async getById(id) {
            return (await database.orm.public.Post
                .include('category')
                .where({ id })
                .first()) ?? undefined
        },
        async addPost(post) {
            return database.orm.public.Post.include('category').create({
                title: post.title,
                content: post.content,
                author: post.author,
                category: category => category.connect({ id: post.categoryId }),
            })
        },
    }
}
