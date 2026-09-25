import { Router } from 'express'
import * as postHandler from '../handlers/post.js'

const router = Router()

router.get('/', postHandler.getAll)
router.get('/:id', postHandler.getById)
router.post('/', postHandler.addPost)

export default router