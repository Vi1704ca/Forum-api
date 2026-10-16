interface ErrorDetails {
    cause?: unknown
    code?: unknown
    constraint?: unknown
    errorMessage?: unknown
    message?: unknown
    sqlState?: unknown
}

function asErrorDetails(error: unknown): ErrorDetails | undefined {
    if (error === null || typeof error !== 'object') {
        return undefined
    }

    return error
}

function hasSqlState(error: unknown, sqlState: string, seen = new Set<object>()): boolean {
    const details = asErrorDetails(error)
    if (!details || seen.has(details)) return false
    seen.add(details)
    return details.sqlState === sqlState || hasSqlState(details.cause, sqlState, seen)
}

function hasErrorMessage(error: unknown, message: string, seen = new Set<object>()): boolean {
    const details = asErrorDetails(error)
    if (!details || seen.has(details)) return false
    seen.add(details)

    const errorMessage = typeof details.errorMessage === 'string'
        ? details.errorMessage
        : typeof details.message === 'string'
            ? details.message
            : ''

    return errorMessage.includes(message) || hasErrorMessage(details.cause, message, seen)
}

function hasConstraint(error: unknown, constraint: string, seen = new Set<object>()): boolean {
    const details = asErrorDetails(error)
    if (!details || seen.has(details)) return false
    seen.add(details)
    return details.constraint === constraint || hasConstraint(details.cause, constraint, seen)
}

export function isUniqueConstraintViolation(error: unknown, constraint: string): boolean {
    return hasSqlState(error, '23505') &&
        hasConstraint(error, constraint) &&
        hasErrorMessage(error, 'duplicate key value violates unique constraint')
}

export function isForeignKeyViolation(error: unknown): boolean {
    return hasSqlState(error, '23503')
}

export function isMissingRelationRow(error: unknown): boolean {
    return asErrorDetails(error)?.code === 'ORM.RELATION_ROW_MISSING' &&
        hasErrorMessage(error, 'connect() nested mutation')
}
