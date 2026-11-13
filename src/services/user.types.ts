import type { PublicUser } from '../domain/user/entity.js'

export interface UserInput {
    email: string
    password: string
}

export interface PasswordHasher {
    hash(password: string): Promise<string>
    verify(password: string, hash: string): Promise<boolean>
}

export interface UserService {
    register(input: UserInput): Promise<PublicUser>
    login(input: UserInput): Promise<{
        user: PublicUser
        accessToken: string
        refreshToken: string
    }>
    getById(id: number): Promise<PublicUser | null>
    refresh(refreshToken: string): Promise<{ user: PublicUser; accessToken: string } | null>
}
