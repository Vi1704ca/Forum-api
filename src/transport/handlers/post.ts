import type { PostService } from '../../services/post.types.js'
import type { CreatePostRequest, GetAllPostsQuery } from '../dto/post/requests.js'
import type { PostResponse } from '../dto/post/responses.js'
import type { Request, RequestHandler, Response } from 'express'

export interface PostHandlers {
    getAll: RequestHandler<Record<string, string>, PostResponse[] | string, unknown, GetAllPostsQuery>
    getById: RequestHandler<{ id: string }, PostResponse | string>
    addPost: RequestHandler<Record<string, string>, PostResponse | string, CreatePostRequest>
}

export function createPostHandlers(postService: PostService): PostHandlers {
    async function getAll(
        req: Request<Record<string, string>, PostResponse[] | string, unknown, GetAllPostsQuery>,
        res: Response<PostResponse[] | string>
    ) {
        const { category, take } = req.query
        const parsedTake = Number(take)
        if (take !== undefined && (!Number.isInteger(parsedTake) || parsedTake <= 0)) {
            return res.status(400).json('Wrong take')
        }
        const result = await postService.getAll(typeof category === 'string' ? category : '', parsedTake || 0)
        return res.status(200).json(result)
    }

    async function getById(req: Request<{ id: string }>, res: Response<PostResponse | string>) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id < 0) {
            return res.status(400).json('Wrong id')
        }
        const result = await postService.getById(id)
        if (!result) {
            return res.status(404).json('There is no post with this id')
        }
        return res.status(200).json(result)
    }

    async function addPost(req: Request<Record<string, string>, PostResponse | string, CreatePostRequest>, res: Response<PostResponse | string>) {
        const { title, content, author, category } = req.body
        if (
            typeof title !== 'string' ||
            typeof content !== 'string' ||
            typeof author !== 'string' ||
            typeof category !== 'string' ||
            !title.trim() ||
            !content.trim() ||
            !author.trim() ||
            !category.trim()
        ) {
            return res.status(422).json('Invalid post data')
        }
        try {
            const result = await postService.addPost({ title, content, author, category })

            if (!result) {
                return res.status(409).json('Conflict. Post with this title already exists')
            }

            return res.status(201).json(result)
        } catch (error) {
            console.log(error)
            return res.status(500).json("Server's error")
        }
    }

    return { getAll, getById, addPost }
}
