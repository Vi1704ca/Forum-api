import type { RequestHandler } from 'express'
import { readCookie } from '../../lib/cookie.js'
import { verifyAccessToken } from '../../lib/accessToken.js'
import { ACCESS_TOKEN_COOKIE } from '../../lib/authCookies.js'

export const requireAuth: RequestHandler = (req, res, next): void => {
    let token = readCookie(req, ACCESS_TOKEN_COOKIE)
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        token = authorization.slice(7).trim()
    }

    if (!token) {
        res.status(401).json({ message: 'Authentication required' })
        return
    }

    try {
        const user = verifyAccessToken(token)
        if (!user) {
            res.status(401).json({ message: 'Invalid access token' })
            return
        }
        res.locals.userId = user.id
        next()
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
