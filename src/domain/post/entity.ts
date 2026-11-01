import type { Category } from '../category/entity.js'
import type { PublicUser } from '../user/entity.js'

export interface Post {
    id: number
    title: string
    content: string
    authorId: number | null
    author: PublicUser | null
    categoryId: number
    category: Category
}

export interface NewPost {
    title: string
    content: string
    authorId: number
    categoryId: number
}