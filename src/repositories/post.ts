import type { NewPost, Post } from '../domain/post/entity.js'
import type { Repository } from '../domain/post/repository.js'

export function createPostRepository(): Repository {
    let posts: Post[] = [
    {
        id: 0,
        title: 'Hallo Welt',
        content: 'Gutten Tag, ich bin ein Post',
        author: 'WikaTi',
        category: 'germany'
    },
    {
        id: 1,
        title: 'Hello World',
        content: 'Hello, I am a Post',
        author: 'Mama',
        category: 'english'
    },
    {
        id: 2,
        title: 'My favorite food',
        content: 'I love pear!',
        author: 'Solomia',
        category: 'english'
    },
    {
        id: 3,
        title: 'Mein Lebensmittel',
        content: 'Ich liebe Birne!',
        author: 'Lehrerin',
        category: 'germany'
    },
    {
        id: 4,
        title: 'JavaScript basics',
        content: 'I am learning JavaScript.',
        author: 'WikaTi',
        category: 'programming'
    },
    ]

    function getAll(category: string, take: number) {
        let result = [...posts]

        if (category) {
            result = result.filter(post => post.category === category)
        }
        if (take) {
            result = result.slice(0, take)
        }

        return result
    }

    function getById(id: number) {
        return posts.find(post => post.id === id)
    }

    async function addPost(post: NewPost) {
        const lastPost = posts[posts.length - 1]
        const newPost: Post = {
            id: lastPost ? lastPost.id + 1 : 0,
            ...post
        }

        posts = [...posts, newPost]
        return newPost
    }

    return { getAll, getById, addPost }
}

