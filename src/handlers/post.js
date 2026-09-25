import * as postService from '../services/post.js'

export function getAll(req, res) {
    const { category, take } = req.query
    const parsedTake = Number(take)

    if (take !== undefined && (!Number.isInteger(parsedTake) || parsedTake <= 0)) {
        return res.status(400).json('Wrong take')
    }

    const result = postService.getAll(category, parsedTake || undefined)
    return res.status(200).json(result)
}

export function getById(req, res) {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id < 0) {
        return res.status(400).json('Wrong id')
    }

    const result = postService.getById(id)
    if (!result) {
        return res.status(404).json('There is no post with this id')
    }

    return res.status(200).json(result)
}

export async function addPost(req, res) {
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
