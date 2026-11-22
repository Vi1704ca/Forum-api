import type { RequestHandler } from 'express'
import { ACCESS_TOKEN_COOKIE } from '../../lib/authCookies.js'

export function createRequireAuth(
    verifyAccessToken: (token: string) => number,
): RequestHandler {
    return (req, res, next): void => {
        const token = req.cookies?.[ACCESS_TOKEN_COOKIE]
        if (typeof token !== 'string') {
            res.status(401).json({ message: 'Authentication required' })
            return
        }

        try {
            res.locals.userId = verifyAccessToken(token)
            next()
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_ACCESS_TOKEN') {
                res.status(401).json({ message: 'Invalid access token' })
                return
            }
            next(error)
        }
    }
}
