import { Router } from 'express'
import type { UserHandlers } from '../handlers/user.js'
import type { RequestHandler } from 'express'

export function createUserRouter(
    userHandlers: UserHandlers,
    requireAuth: RequestHandler,
) {
    const router = Router()
    router.post('/register', userHandlers.register)
    router.post('/login', userHandlers.login)
    router.get('/me', requireAuth, userHandlers.me)
    router.post('/refresh', userHandlers.refresh)
    router.post('/logout', userHandlers.logout)
    return router
}
