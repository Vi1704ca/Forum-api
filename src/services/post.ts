import type { Repository } from '../domain/post/repository.js'
import type { NewPost } from '../domain/post/entity.js'
import type { PostService } from './post.types.js'

export function createPostService(postRepository: Repository): PostService {
    async function addPost(post: NewPost) {
        return postRepository.addPost(post)
    }

    return {
        getAll: filter => postRepository.getAll(filter),
        getById: id => postRepository.getById(id),
        addPost
    }
}
