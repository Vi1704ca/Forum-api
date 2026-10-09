import express from 'express'
import { db } from './prisma/db.js'
import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post.js'
import { createPostHandlers } from './transport/handlers/post.js'
import { createPostRouter } from './transport/routers/post.js'

const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandlers = createPostHandlers(postService)
const postRouter = createPostRouter(postHandlers)

const app = express()
app.use(express.json())
app.use('/posts', postRouter)

const HOST = 'localhost'
const PORT = 3000 

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}/`)
})
