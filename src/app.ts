import express from 'express'
import { passwordHasher } from './lib/password.js'
import { db } from './prisma/db.js'
import { createCategoryRepository } from './repositories/category.js'
import { createPostRepository } from './repositories/post.js'
import { createCategoryService } from './services/category.js'
import { createPostService } from './services/post.js'
import { createUserService } from './services/user.js'
import { createCategoryHandlers } from './transport/handlers/category.js'
import { createPostHandlers } from './transport/handlers/post.js'
import { createUserHandlers } from './transport/handlers/user.js'
import { createCategoryRouter } from './transport/routers/category.js'
import { createPostRouter } from './transport/routers/post.js'
import { createUserRouter } from './transport/routers/user.js'
import { createUserRepository } from './repositories/user.js'

const categoryRepository = createCategoryRepository(db)
const postRepository = createPostRepository(db)
const categoryService = createCategoryService(categoryRepository)
const postService = createPostService(postRepository)
const categoryHandlers = createCategoryHandlers(categoryService)
const postHandlers = createPostHandlers(postService)
const categoryRouter = createCategoryRouter(categoryHandlers)
const postRouter = createPostRouter(postHandlers)
const userRepository = createUserRepository(db)
const userService = createUserService(userRepository, passwordHasher)
const userHandlers = createUserHandlers(userService)
const userRouter = createUserRouter(userHandlers)

const app = express()
app.use(express.json())
app.use('/categories', categoryRouter)
app.use('/posts', postRouter)
app.use('/', userRouter)

const HOST = 'localhost'
const PORT = 3000 

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}/`)
})
