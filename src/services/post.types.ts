import type { NewPost, Post } from '../domain/post/entity.js'

export interface PostService {
    getAll(): Promise<Post[]>
    getById(id: number): Promise<Post | null>
    getByAuthorId(authorId: number): Promise<Post[]>
    addPost(post: NewPost): Promise<Post>
}