import type { NewPost, Post, PostFilter } from './entity.js'

export interface Repository {
    getAll(filter: PostFilter): Promise<Post[]>
    getById(id: number): Promise<Post | undefined>
    addPost(post: NewPost): Promise<Post | undefined>
}