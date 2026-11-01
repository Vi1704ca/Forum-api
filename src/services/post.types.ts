import type { NewPost, Post } from '../domain/post/entity.js'

export interface PostService {
    getAll(): Promise<Post[]>
    getById(id: number): Promise<Post | null>
    addPost(post: NewPost): Promise<Post>
}