import * as postRepo from '../repositories/post.js'

export function getAll(category: string, take: number) {
    return postRepo.getAll(category, take)
}

export function getById(id: number) {
    return postRepo.getById(id)
}

export async function addPost(body: { title: string, content: string, author: string, category: string }) {
    const { title } = body
    
    const allPosts = postRepo.getAll(body.category, Number.MAX_SAFE_INTEGER)
    const existingPost = allPosts.find(post => post.title === title)
    if (existingPost) {
        return null
    }
    return postRepo.addPost(body)
}
