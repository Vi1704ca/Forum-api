import type { Repository } from '../domain/post/repository.js'
import type { NewPost } from '../domain/post/entity.js'
import type { PostService } from './post.types.js'

export function createPostService(postRepository: Repository): PostService {
    async function addPost(post: NewPost) {
        const allPosts = await postRepository.getAll(post.category, 0)
        const existingPost = allPosts.find(existing => existing.title === post.title)
        if (existingPost) {
            return null
        }
        return postRepository.addPost(post)
    }

    return {
        getAll: (category, take) => postRepository.getAll(category, take),
        getById: id => postRepository.getById(id),
        addPost
    }
}
