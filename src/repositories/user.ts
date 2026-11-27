import type { UserRepository } from "../domain/user/repository.js";
import type { Database } from "../prisma/db.js";

export function createUserRepository(database: Database): UserRepository {
	return {
		async findByEmail(email) {
			return database.orm.public.User.where({ email }).first();
		},
		async findById(id) {
			return database.orm.public.User.where({ id }).first();
		},
		async createUser(user) {
			return database.orm.public.User.create(user);
		},
	};
}
