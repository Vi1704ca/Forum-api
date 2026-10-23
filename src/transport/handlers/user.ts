import type { RequestHandler } from 'express'
import type { UserService } from '../../services/user.types.js'
import { isUniqueConstraintViolation } from '../errors.js'
import type { ErrorResponse } from '../dto/user/errors.js'
import type { RegisterUserRequest } from '../dto/user/requests.js'
import type { UserResponse } from '../dto/user/responses.js'

export interface UserHandlers {
    register: RequestHandler<Record<string, string>, UserResponse | ErrorResponse, RegisterUserRequest>
}

export function createUserHandlers(userService: UserService): UserHandlers {
    const register: UserHandlers['register'] = async (req, res): Promise<void> => {
        const body = req.body
        if (body === null || typeof body !== 'object' || Array.isArray(body)) {
            res.status(422).json({ message: 'Invalid registration fields' })
            return
        }

        const { email, password } = body
        const emailParts = typeof email === 'string' ? email.trim().split('@') : []
        const emailName = emailParts[0]
        const emailDomain = emailParts[1]
        if (
            typeof email !== 'string' ||
            emailParts.length !== 2 ||
            !emailName ||
            !emailDomain ||
            !emailDomain.includes('.') ||
            emailDomain.startsWith('.') ||
            emailDomain.endsWith('.') ||
            typeof password !== 'string' ||
            password.length < 8
        ) {
            res.status(422).json({
                message: 'A valid email and a password of at least 8 characters are required',
            })
            return
        }

        try {
            const user = await userService.register({ email, password })
            res.status(201).json(user)
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'USER_ALREADY_EXISTS'
            ) {
                res.status(409).json({ message: 'User with this email already exists' })
                return
            }
            if (isUniqueConstraintViolation(error, 'User_email_key')) {
                res.status(409).json({ message: 'User with this email already exists' })
                return
            }
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    return { register }
}
