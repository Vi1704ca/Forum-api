import type { NewPost, Post } from './entity.js'

export interface Repository {
    getAll(): Promise<Post[]>
    getById(id: number): Promise<Post | null>
    addPost(post: NewPost): Promise<Post>
}