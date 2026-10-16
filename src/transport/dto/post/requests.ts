export interface GetAllPostsQuery {
	category?: string | string[]
	categoryId?: string | string[]
	take?: string | string[]
}

export interface CreatePostRequest {
	title: string
	content: string
	author: string
	categoryId: number
}
