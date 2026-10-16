import type { NewPost, Post, PostFilter } from '../domain/post/entity.js'

export interface PostService {
    getAll(filter: PostFilter): Promise<Post[]>
    getById(id: number): Promise<Post | undefined>
    addPost(post: NewPost): Promise<Post | undefined>
}