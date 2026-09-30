export interface GetAllPostsQuery {
	category?: string | string[]
	take?: string | string[]
}

export interface CreatePostRequest {
	title: string
	content: string
	author: string
	category: string
}
