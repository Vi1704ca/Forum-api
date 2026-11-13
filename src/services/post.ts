import type { Repository } from '../domain/post/repository.js'
import type { NewPost } from '../domain/post/entity.js'
import type { PostService } from './post.types.js'

export function createPostService(postRepository: Repository): PostService {
    return {
        getAll: () => postRepository.getAll(),
        getById: id => postRepository.getById(id),
        getByAuthorId: authorId => postRepository.getByAuthorId(authorId),
        addPost: post => postRepository.addPost(post),
    }
}
