import type { CategoryResponse } from '../category/responses.js'
import type { UserResponse } from '../user/responses.js'

export interface PostResponse {
    id: number
    title: string
    content: string
    authorId: number | null
    author: UserResponse | null
    categoryId: number
    category: CategoryResponse
}
