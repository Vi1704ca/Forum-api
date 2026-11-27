import type { RefreshSessionRepository } from "../domain/refreshSession/repository.js";
import type { Database } from "../prisma/db.js";

export function createRefreshSessionRepository(
	database: Database,
): RefreshSessionRepository {
	return {
		async create(session) {
			await database.orm.public.RefreshSession.create(session);
		},
		async getByHash(tokenHash) {
			return database.orm.public.RefreshSession.where({
				tokenHash,
			}).first();
		},
		async rotate(oldHash, newHash, newId) {
			const updated = await database.orm.public.RefreshSession.where({
				tokenHash: oldHash,
			}).update({ id: newId, tokenHash: newHash });
			return updated !== null;
		},
		async deleteByHash(tokenHash) {
			await database.orm.public.RefreshSession.where({
				tokenHash,
			}).delete();
		},
	};
}
