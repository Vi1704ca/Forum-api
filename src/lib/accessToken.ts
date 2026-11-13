import jwt from 'jsonwebtoken'
import type { PublicUser } from '../domain/user/entity.js'

function jwtSecret(): string {
    const secret = process.env['JWT_SECRET']
    if (!secret) {
        throw new Error('JWT_SECRET is not configured')
    }
    return secret
}

function createToken(user: PublicUser, tokenType: 'access' | 'refresh'): string {
    return jwt.sign({
        email: user.email,
        tokenType,
    }, jwtSecret(), {
        subject: String(user.id),
        expiresIn: tokenType === 'access' ? '1h' : '7d',
    })
}

export function createAccessToken(user: PublicUser): string {
    return createToken(user, 'access')
}

export function createRefreshToken(user: PublicUser): string {
    return createToken(user, 'refresh')
}

function verifyToken(token: string, tokenType: 'access' | 'refresh'): PublicUser | null {
    try {
        const payload = jwt.verify(token, jwtSecret())
        if (
            typeof payload === 'string' ||
            payload.tokenType !== tokenType ||
            typeof payload.email !== 'string'
        ) {
            return null
        }

        const id = Number(payload.sub)
        if (!Number.isSafeInteger(id) || id <= 0) {
            return null
        }

        return { id, email: payload.email }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return null
        }
        throw error
    }
}

export function verifyAccessToken(token: string): PublicUser | null {
    return verifyToken(token, 'access')
}

export function verifyRefreshToken(token: string): PublicUser | null {
    return verifyToken(token, 'refresh')
}
