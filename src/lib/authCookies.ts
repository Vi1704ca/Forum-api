import type { Response } from 'express'

export const ACCESS_TOKEN_COOKIE = 'accessToken'
export const REFRESH_TOKEN_COOKIE = 'refreshToken'

export function setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken?: string,
): void {
    const secure = process.env['NODE_ENV'] === 'production'

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure,
        maxAge: 60 * 60 * 1000,
        path: '/',
    })

    if (refreshToken) {
        res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/refresh',
        })
    }
}

export function clearAuthCookies(res: Response): void {
    const secure = process.env['NODE_ENV'] === 'production'

    res.clearCookie(ACCESS_TOKEN_COOKIE, {
        httpOnly: true,
        sameSite: 'lax',
        secure,
        path: '/',
    })

    res.clearCookie(REFRESH_TOKEN_COOKIE, {
        httpOnly: true,
        sameSite: 'lax',
        secure,
        path: '/refresh',
    })
}
