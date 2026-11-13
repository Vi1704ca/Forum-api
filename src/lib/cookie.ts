import type { Request } from 'express'

export function readCookie(request: Request, name: string): string | undefined {
    const cookies = request.headers.cookie?.split(';') ?? []
    for (const cookie of cookies) {
        const separator = cookie.indexOf('=')
        if (separator < 0 || cookie.slice(0, separator).trim() !== name) {
            continue
        }
        return cookie.slice(separator + 1).trim()
    }
    return undefined
}
