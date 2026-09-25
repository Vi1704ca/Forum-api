let posts = [
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


export function getAll(category, take) {
    let result = [...posts]

    if (category) {
        result = result.filter(post => post.category === category)
    }
    if (take) {
        result = result.slice(0, take)
    }

    return result
}

export function getById(id) {
    return posts.find(post => post.id === id)
}

export async function addPost(post) {
    const newPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 0,
        ...post
    }

    posts = [...posts, newPost]
    return newPost
}

