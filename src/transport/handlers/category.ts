import type { CategoryService } from '../../services/category.types.js'
import type { CreateCategoryRequest } from '../dto/category/requests.js'
import type { CategoryResponse } from '../dto/category/responses.js'
import { isUniqueConstraintViolation } from '../errors.js'
import type { RequestHandler } from 'express'

export interface CategoryHandlers {
    getAll: RequestHandler<Record<string, string>, CategoryResponse[] | string>
    getById: RequestHandler<{ id: string }, CategoryResponse | string>
    addCategory: RequestHandler<Record<string, string>, CategoryResponse | string, CreateCategoryRequest>
}

export function createCategoryHandlers(categoryService: CategoryService): CategoryHandlers {
    const getAll: CategoryHandlers['getAll'] = async (_req, res): Promise<void> => {
        try {
            const categories = await categoryService.getAll()
            res.status(200).json(categories)
        } catch (error) {
            console.error(error)
            res.status(500).json("Server's error")
        }
    }

    const getById: CategoryHandlers['getById'] = async (req, res): Promise<void> => {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json('Invalid id')
            return
        }

        try {
            const category = await categoryService.getById(id)
            if (!category) {
                res.status(404).json('There is no category with this id')
                return
            }
            res.status(200).json(category)
        } catch (error) {
            console.error(error)
            res.status(500).json("Server's error")
        }
    }

    const addCategory: CategoryHandlers['addCategory'] = async (req, res): Promise<void> => {
        if (
            req.body === null ||
            typeof req.body !== 'object' ||
            Array.isArray(req.body) ||
            Object.keys(req.body).some(field => field !== 'name')
        ) {
            res.status(422).json('Invalid category fields')
            return
        }

        const { name } = req.body
        if (typeof name !== 'string' || !name.trim()) {
            res.status(422).json('Invalid category data')
            return
        }

        try {
            const category = await categoryService.addCategory({ name })
            res.status(201).json(category)
        } catch (error) {
            if (isUniqueConstraintViolation(error, 'Category_name_key')) {
                res.status(409).json('Category with this name already exists')
                return
            }
            console.error(error)
            res.status(500).json("Server's error")
        }
    }

    return { getAll, getById, addCategory }
}
