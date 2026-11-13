import { Router } from 'express'
import type { PostHandlers } from '../handlers/post.js'
import { requireAuth } from '../middleware/requireAuth.js'

export function createPostRouter(postHandlers: PostHandlers) {
	const router = Router()

	router.get('/', postHandlers.getAll)
	router.get('/me', requireAuth, postHandlers.getOwnPosts)
	router.get('/:id', postHandlers.getById)
	router.post('/', postHandlers.addPost)

	return router
}