function hasSqlState(error: unknown, sqlState: string): boolean {
    if (error === null || typeof error !== 'object') {
        return false
    }

    const candidate = error as { sqlState?: unknown; cause?: unknown }
    return candidate.sqlState === sqlState || hasSqlState(candidate.cause, sqlState)
}

export function isUniqueConstraintViolation(error: unknown): boolean {
    return hasSqlState(error, '23505')
}

export function isForeignKeyViolation(error: unknown): boolean {
    return hasSqlState(error, '23503')
}
