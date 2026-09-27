import * as postRepo from '../repositories/post.js';
export function getAll(category, take) {
    return postRepo.getAll(category, take);
}
export function getById(id) {
    return postRepo.getById(id);
}
export async function addPost(body) {
    const { title } = body;
    const allPosts = postRepo.getAll(body.category, Number.MAX_SAFE_INTEGER);
    const existingPost = allPosts.find(post => post.title === title);
    if (existingPost) {
        return null;
    }
    return postRepo.addPost(body);
}
