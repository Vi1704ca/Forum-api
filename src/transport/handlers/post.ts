import type { PostService } from '../../services/post.types.js'
import type { CreatePostRequest } from '../dto/post/requests.js'
import type { PostResponse } from '../dto/post/responses.js'
import {
    isForeignKeyViolation,
    isMissingRelationRow,
    isUniqueConstraintViolation,
} from '../errors.js'

import type { RequestHandler } from 'express'

export interface PostHandlers {
    getAll: RequestHandler<Record<string, string>, PostResponse[] | string>
    getById: RequestHandler<{ id: string }, PostResponse | string>
    getOwnPosts: RequestHandler<Record<string, string>, PostResponse[] | string>
    addPost: RequestHandler<Record<string, string>, PostResponse | string, CreatePostRequest>
}

export function createPostHandlers(postService: PostService): PostHandlers {
    const getAll: PostHandlers['getAll'] = async (_req, res): Promise<void> => {
        try {
            const result = await postService.getAll()
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

    const getOwnPosts: PostHandlers['getOwnPosts'] = async (_req, res): Promise<void> => {
        try {
            const posts = await postService.getByAuthorId(res.locals.userId)
            res.status(200).json(posts)
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
            Object.keys(req.body).some(field => !['title', 'content', 'authorId', 'categoryId'].includes(field))
        ) {
            res.status(422).json('Invalid post fields')
            return
        }

        const { title, content, authorId, categoryId } = req.body
        if (
            typeof title !== 'string' ||
            typeof content !== 'string' ||
            !title.trim() ||
            !content.trim()
        ) {
            res.status(422).json('Invalid post data')
            return
        }

        if (!Number.isInteger(authorId) || authorId <= 0) {
            res.status(400).json('Invalid authorId')
            return
        }

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            res.status(400).json('Invalid categoryId')
            return
        }

        try {
            const result = await postService.addPost({ title, content, authorId, categoryId })
            if (!result) {
                res.status(404).json('There is no referenced user or category with this id')
                return
            }
            res.status(201).json(result)
        } catch (error) {
            if (isUniqueConstraintViolation(error, 'Post_title_key')) {
                res.status(409).json('Post with this title already exists')
                return
            }
            if (isForeignKeyViolation(error) || isMissingRelationRow(error)) {
                res.status(404).json('There is no referenced user or category with this id')
                return
            }
            console.error(error)
            res.status(500).json("Server's error")
        }
    }

    return { getAll, getById, getOwnPosts, addPost }
}
