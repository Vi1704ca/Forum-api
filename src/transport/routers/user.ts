import { Router } from 'express'
import type { UserHandlers } from '../handlers/user.js'

export function createUserRouter(userHandlers: UserHandlers) {
    const router = Router()
    router.post('/register', userHandlers.register)
    return router
}
