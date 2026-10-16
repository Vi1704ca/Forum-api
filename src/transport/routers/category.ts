import { Router } from 'express'
import type { CategoryHandlers } from '../handlers/category.js'

export function createCategoryRouter(categoryHandlers: CategoryHandlers) {
    const router = Router()

    router.get('/', categoryHandlers.getAll)
    router.get('/:id', categoryHandlers.getById)
    router.post('/', categoryHandlers.addCategory)

    return router
}
