import type { User } from "./entity.js"

export type NewUser = Omit<User, "id">

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>
    createUser(user: NewUser): Promise<User>
}
