import 'dotenv/config'
import { createHash, randomUUID } from 'node:crypto'
import jwt, { type JwtPayload } from 'jsonwebtoken'

function getSecret(name: string): string {
    const secret = process.env[name]
    if (!secret) throw new Error(`${name} is not defined`)
    return secret
}

const accessSecret = getSecret('JWT_ACCESS_SECRET')
const refreshSecret = getSecret('JWT_REFRESH_SECRET')

export function signAccessToken(userId: number): string {
    return jwt.sign({}, accessSecret, {
        algorithm: 'HS256',
        subject: String(userId),
        expiresIn: '15m',
    })
}

export function signRefreshToken(userId: number): string {
    return jwt.sign({ type: 'refresh' }, refreshSecret, {
        algorithm: 'HS256',
        subject: String(userId),
        expiresIn: '7d',
        jwtid: randomUUID(),
    })
}

export function hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
}

function verifyToken(token: string, secret: string): JwtPayload {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] })
    if (typeof payload === 'string') {
        throw new Error()
    }
    return payload
}

function getUserId(payload: JwtPayload): number {
    const userId = Number(payload.sub)
    if (!Number.isSafeInteger(userId) || userId <= 0) {
        throw new Error()
    }
    return userId
}

export function verifyAccessToken(token: string): number {
    try {
        return getUserId(verifyToken(token, accessSecret))
    } catch {
        throw new Error('INVALID_ACCESS_TOKEN')
    }
}

export function verifyRefreshToken(token: string): number {
    try {
        const payload = verifyToken(token, refreshSecret)
        if (payload.type !== 'refresh') {
            throw new Error()
        }
        return getUserId(payload)
    } catch {
        throw new Error('INVALID_REFRESH_TOKEN')
    }
}
