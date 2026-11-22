export interface RefreshSession {
    id: string
    userId: number
    tokenHash: string
    createdAt: string
    updatedAt: string
}

export type NewRefreshSession = Pick<RefreshSession, 'id' | 'userId' | 'tokenHash'>
