import type { AppConfig } from "../config.js";
import { createTokenService, hashRefreshToken } from "../lib/jwt.js";
import type { Database } from "../prisma/db.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { createRefreshSessionRepository } from "../repositories/refreshSession.js";
import { createUserRepository } from "../repositories/user.js";
import { createAuthService } from "../services/auth/auth.js";
import { createUserHandlers } from "../transport/handlers/user.js";
import { createRequireAuth } from "../transport/middleware/requireAuth.js";
import { createUserRouter } from "../transport/routers/user.js";

// Модуль збирає залежності авторизації з налаштувань, не читаючи їх в інших шарах.
export function createAuthModule(database: Database, config: AppConfig["jwt"]) {
	const userRepository = createUserRepository(database);
	const refreshSessionRepository = createRefreshSessionRepository(database);
	const tokens = createTokenService(config);
	const authService = createAuthService({
		users: userRepository,
		sessions: refreshSessionRepository,
		passwords: { hash: hashPassword, verify: verifyPassword },
		tokens,
		tokenHasher: { hash: hashRefreshToken },
	});
	const handlers = createUserHandlers(authService);
	const requireAuth = createRequireAuth(tokens.verifyAccessToken);

	return {
		router: createUserRouter(handlers, requireAuth),
		requireAuth,
	};
}
