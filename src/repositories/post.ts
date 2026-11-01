import type { Repository } from '../domain/post/repository.js'

type Database = typeof import('../prisma/db.js').db

function postsWithRelations(database: Database) {
    return database.orm.public.Post
        .include('category')
        .include('author', author => author.select('id', 'email'))
}

function withoutAuthorName<T extends { authorName: unknown }>(post: T) {
    const { authorName: _authorName, ...postData } = post
    return postData
}

export function createPostRepository(database: Database): Repository {
    return {
        async getAll() {
            const posts = await postsWithRelations(database)
                .orderBy(post => post.id.asc())
                .all()
            return posts.map(withoutAuthorName)
        },
        async getById(id) {
            const post = await postsWithRelations(database)
                .where({ id })
                .first()
            return post ? withoutAuthorName(post) : null
        },
        async addPost(post) {
            const createdPost = await postsWithRelations(database).create({
                title: post.title,
                content: post.content,
                category: category => category.connect({ id: post.categoryId }),
                author: author => author.connect({ id: post.authorId }),
            })
            return withoutAuthorName(createdPost)
        },
    }
}
