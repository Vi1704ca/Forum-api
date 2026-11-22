import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { hashPassword, verifyPassword } from './lib/password.js'
import {
    hashRefreshToken,
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from './lib/jwt.js'
import { db } from './prisma/db.js'
import { createCategoryRepository } from './repositories/category.js'
import { createPostRepository } from './repositories/post.js'
import { createCategoryService } from './services/category.js'
import { createPostService } from './services/post.js'
import { createAuthService } from './services/auth/auth.js'
import { createCategoryHandlers } from './transport/handlers/category.js'
import { createPostHandlers } from './transport/handlers/post.js'
import { createUserHandlers } from './transport/handlers/user.js'
import { createCategoryRouter } from './transport/routers/category.js'
import { createPostRouter } from './transport/routers/post.js'
import { createUserRouter } from './transport/routers/user.js'
import { createUserRepository } from './repositories/user.js'
import { createRefreshSessionRepository } from './repositories/refreshSession.js'
import { createRequireAuth } from './transport/middleware/requireAuth.js'

const categoryRepository = createCategoryRepository(db)
const postRepository = createPostRepository(db)
const categoryService = createCategoryService(categoryRepository)
const postService = createPostService(postRepository)
const categoryHandlers = createCategoryHandlers(categoryService)
const postHandlers = createPostHandlers(postService)
const categoryRouter = createCategoryRouter(categoryHandlers)
const requireAuth = createRequireAuth(verifyAccessToken)
const postRouter = createPostRouter(postHandlers, requireAuth)
const userRepository = createUserRepository(db)
const refreshSessionRepository = createRefreshSessionRepository(db)
const authService = createAuthService(
    userRepository,
    { hash: hashPassword, verify: verifyPassword },
    { signAccessToken, signRefreshToken },
    { verifyRefreshToken },
    refreshSessionRepository,
    { hash: hashRefreshToken },
)
const userHandlers = createUserHandlers(authService)
const userRouter = createUserRouter(
    userHandlers,
    requireAuth,
)

const app = express()
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())
app.use('/categories', categoryRouter)
app.use('/posts', postRouter)
app.use('/auth', userRouter)
app.use('/', userRouter)

const HOST = 'localhost'
const PORT = 3000 

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}/`)
})
