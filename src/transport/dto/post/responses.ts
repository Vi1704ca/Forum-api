import type { CategoryResponse } from '../category/responses.js'

export interface PostResponse {
    id: number
    title: string
    content: string
    author: string
    categoryId: number
    category: CategoryResponse
}
