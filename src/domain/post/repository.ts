import type { NewPost, Post } from './entity.js'

export interface Repository {
    getAll(): Promise<Post[]>
    getById(id: number): Promise<Post | null>
    getByAuthorId(authorId: number): Promise<Post[]>
    addPost(post: NewPost): Promise<Post>
}