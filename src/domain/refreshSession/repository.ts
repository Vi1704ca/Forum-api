import type { NewRefreshSession, RefreshSession } from "./entity.js";

export interface RefreshSessionRepository {
	create(session: NewRefreshSession): Promise<void>;
	getByHash(tokenHash: string): Promise<RefreshSession | null>;
	rotate(oldHash: string, newHash: string, newId: string): Promise<boolean>;
	deleteByHash(tokenHash: string): Promise<void>;
}
