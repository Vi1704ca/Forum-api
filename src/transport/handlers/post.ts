import type { PostService } from '../../services/post.types.js'
import type { CreatePostRequest, GetAllPostsQuery } from '../dto/post/requests.js'
import type { PostResponse } from '../dto/post/responses.js'
import {
    isForeignKeyViolation,
    isMissingRelationRow,
    isUniqueConstraintViolation,
} from '../errors.js'
import type { RequestHandler } from 'express'

export interface PostHandlers {
    getAll: RequestHandler<Record<string, string>, PostResponse[] | string, unknown, GetAllPostsQuery>
    getById: RequestHandler<{ id: string }, PostResponse | string>
    addPost: RequestHandler<Record<string, string>, PostResponse | string, CreatePostRequest>
}

export function createPostHandlers(postService: PostService): PostHandlers {
    const getAll: PostHandlers['getAll'] = async (req, res): Promise<void> => {
        const allowedQueryFields = ['category', 'categoryId', 'take']
        if (Object.keys(req.query).some(field => !allowedQueryFields.includes(field))) {
            res.status(422).json('Invalid query fields')
            return
        }

        const { category, categoryId, take } = req.query
        if (
            (category !== undefined && typeof category !== 'string') ||
            (take !== undefined && typeof take !== 'string') ||
            (categoryId !== undefined && typeof categoryId !== 'string')
        ) {
            res.status(422).json('Invalid query fields')
            return
        }

        let parsedCategoryId: number | undefined
        if (categoryId !== undefined) {
            parsedCategoryId = Number(categoryId)
            if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
                res.status(400).json('Invalid categoryId')
                return
            }
        }

        let parsedTake: number | undefined
        if (take !== undefined) {
            parsedTake = Number(take)
            if (!Number.isInteger(parsedTake) || parsedTake <= 0) {
                res.status(400).json('Invalid take')
                return
            }
        }

        try {
            const result = await postService.getAll({
                ...(category !== undefined ? { category } : {}),
                ...(parsedCategoryId !== undefined ? { categoryId: parsedCategoryId } : {}),
                ...(parsedTake !== undefined ? { take: parsedTake } : {}),
            })
            res.status(200).json(result)
        } catch (error) {
            console.error(error)
            res.status(500).json("Server's error")
        }
    }

    const getById: PostHandlers['getById'] = async (req, res): Promise<void> => {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json('Invalid id')
            return
        }

        try {
            const result = await postService.getById(id)
            if (!result) {
                res.status(404).json('There is no post with this id')
                return
            }
            res.status(200).json(result)
        } catch (error) {
            console.error(error)
            res.status(500).json("Server's error")
        }
    }

    const addPost: PostHandlers['addPost'] = async (req, res): Promise<void> => {
        if (
            req.body === null ||
            typeof req.body !== 'object' ||
            Array.isArray(req.body) ||
            Object.keys(req.body).some(field => !['title', 'content', 'author', 'categoryId'].includes(field))
        ) {
            res.status(422).json('Invalid post fields')
            return
        }

        const { title, content, author, categoryId } = req.body
        if (
            typeof title !== 'string' ||
            typeof content !== 'string' ||
            typeof author !== 'string' ||
            !title.trim() ||
            !content.trim() ||
            !author.trim()
        ) {
            res.status(422).json('Invalid post data')
            return
        }

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            res.status(400).json('Invalid categoryId')
            return
        }

        try {
            const result = await postService.addPost({ title, content, author, categoryId })
            if (!result) {
                res.status(404).json('There is no category with this id')
                return
            }
            res.status(201).json(result)
        } catch (error) {
            if (isUniqueConstraintViolation(error, 'Post_title_key')) {
                res.status(409).json('Post with this title already exists')
                return
            }
            if (isForeignKeyViolation(error) || isMissingRelationRow(error)) {
                res.status(404).json('There is no category with this id')
                return
            }
            console.error(error)
            res.status(500).json("Server's error")
        }
    }

    return { getAll, getById, addPost }
}
