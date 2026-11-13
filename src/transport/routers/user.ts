import { Router } from 'express'
import type { UserHandlers } from '../handlers/user.js'
import { requireAuth } from '../middleware/requireAuth.js'

export function createUserRouter(userHandlers: UserHandlers) {
    const router = Router()
    router.post('/register', userHandlers.register)
    router.post('/login', userHandlers.login)
    router.get('/me', requireAuth, userHandlers.me)
    router.post('/refresh', userHandlers.refresh)
    return router
}
