import jwt from 'jsonwebtoken'
import type { PublicUser } from '../domain/user/entity.js'

export function createAccessToken(user: PublicUser): string {
    return jwt.sign({
        email: user.email,
    }, process.env['JWT_SECRET']!, {
        subject: String(user.id),
        expiresIn: '1h',
    })
}
