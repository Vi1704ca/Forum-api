import type { Category } from '../category/entity.js'

export interface Post {
    id: number
    title: string
    content: string
    author: string
    categoryId: number
    category: Category
}

export interface NewPost {
    title: string
    content: string
    author: string
    categoryId: number
}

export interface PostFilter {
    category?: string
    categoryId?: number
    take?: number
}