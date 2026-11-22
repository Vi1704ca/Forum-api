import type { PublicUser } from '../../domain/user/entity.js'

export interface AuthInput {
    email: string
    password: string
}

export interface PasswordHasher {
    hash(password: string): Promise<string>
    verify(hash: string, password: string): Promise<boolean>
}

export interface TokenHasher {
    hash(token: string): string
}

export interface TokenSigner {
    signAccessToken(userId: number): string
    signRefreshToken(userId: number): string
}

export interface TokenVerifier {
    verifyRefreshToken(token: string): number
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface AuthService {
    register(input: AuthInput): Promise<PublicUser>
    login(input: AuthInput): Promise<{ user: PublicUser } & AuthTokens>
    refresh(refreshToken: string): Promise<{ user: PublicUser } & AuthTokens>
    me(userId: number): Promise<PublicUser>
    logout(refreshToken: string | undefined): Promise<void>
}
