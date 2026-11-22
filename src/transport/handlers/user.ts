import type { RequestHandler } from 'express'
import type { AuthService } from '../../services/auth/auth.types.js'
import { isUniqueConstraintViolation } from '../errors.js'
import type { ErrorResponse } from '../dto/user/errors.js'
import type { RegisterUserRequest } from '../dto/user/requests.js'
import type { UserResponse } from '../dto/user/responses.js'
import {
    REFRESH_TOKEN_COOKIE,
    clearAuthCookies,
    setAuthCookies,
} from '../../lib/authCookies.js'

function isValidEmail(email: unknown): email is string {
    if (typeof email !== 'string') return false

    const emailParts = email.trim().split('@')
    if (emailParts.length !== 2) return false

    const emailName = emailParts[0]
    const emailDomain = emailParts[1]
    if (!emailName || !emailDomain) return false

    return emailDomain.includes('.') &&
        !emailDomain.startsWith('.') &&
        !emailDomain.endsWith('.')
}

export interface UserHandlers {
    register: RequestHandler<Record<string, string>, UserResponse | ErrorResponse, RegisterUserRequest>
    login: RequestHandler<Record<string, string>, UserResponse | ErrorResponse, RegisterUserRequest>
    me: RequestHandler<Record<string, string>, UserResponse | ErrorResponse>
    refresh: RequestHandler<Record<string, string>, UserResponse | ErrorResponse>
    logout: RequestHandler<Record<string, string>, void | ErrorResponse>
}

export function createUserHandlers(authService: AuthService): UserHandlers {
    const register: UserHandlers['register'] = async (req, res): Promise<void> => {
        const body = req.body
        if (body === null || typeof body !== 'object' || Array.isArray(body)) {
            res.status(422).json({ message: 'Invalid registration fields' })
            return
        }

        const { email, password } = body
        if (
            !isValidEmail(email) ||
            typeof password !== 'string' ||
            password.length < 8
        ) {
            res.status(422).json({
                message: 'A valid email and a password of at least 8 characters are required',
            })
            return
        }

        try {
            const user = await authService.register({ email, password })
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

    const login: UserHandlers['login'] = async (req, res): Promise<void> => {
        const body = req.body
        if (body === null || typeof body !== 'object' || Array.isArray(body)) {
            res.status(422).json({ message: 'Invalid login fields' })
            return
        }

        const { email, password } = body
        if (
            !isValidEmail(email) ||
            typeof password !== 'string' ||
            !password
        ) {
            res.status(422).json({ message: 'A valid email and password are required' })
            return
        }

        try {
            const result = await authService.login({ email, password })
            setAuthCookies(res, result.accessToken, result.refreshToken)
            res.status(200).json(result.user)
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
                res.status(401).json({ message: 'Invalid email or password' })
                return
            }
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    const me: UserHandlers['me'] = async (_req, res): Promise<void> => {
        try {
            const user = await authService.me(res.locals.userId)
            res.status(200).json(user)
        } catch (error) {
            if (error instanceof Error && error.message === 'UNAUTHORIZED') {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    const refresh: UserHandlers['refresh'] = async (req, res): Promise<void> => {
        const token = req.cookies?.[REFRESH_TOKEN_COOKIE]
        if (typeof token !== 'string') {
            clearAuthCookies(res)
            res.status(401).json({ message: 'Refresh token required' })
            return
        }

        try {
            const result = await authService.refresh(token)
            setAuthCookies(res, result.accessToken, result.refreshToken)
            res.status(200).json(result.user)
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'INVALID_REFRESH_TOKEN'
            ) {
                clearAuthCookies(res)
                res.status(401).json({ message: 'Invalid or expired refresh token' })
                return
            }
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    const logout: UserHandlers['logout'] = async (req, res): Promise<void> => {
        const token = req.cookies?.[REFRESH_TOKEN_COOKIE]
        const refreshToken = typeof token === 'string' ? token : undefined
        clearAuthCookies(res)

        try {
            await authService.logout(refreshToken)
            res.status(204).end()
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    return { register, login, me, refresh, logout }
}
