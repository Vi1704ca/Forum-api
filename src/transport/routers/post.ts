import { Router } from 'express'
import type { PostHandlers } from '../handlers/post.js'

export function createPostRouter(postHandlers: PostHandlers) {
	const router = Router()

	router.get('/', postHandlers.getAll)
	router.get('/:id', postHandlers.getById)
	router.post('/', postHandlers.addPost)

	return router
}