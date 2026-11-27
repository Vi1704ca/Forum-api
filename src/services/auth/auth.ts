import { randomUUID } from "node:crypto";
import type { AuthService, AuthServiceDependencies } from "./auth.types.js";

export function createAuthService({
	users,
	sessions,
	passwords,
	tokens,
	tokenHasher,
}: AuthServiceDependencies): AuthService {
	return {
		async register(input) {
			const email = input.email.trim().toLowerCase();
			const existingUser = await users.findByEmail(email);
			if (existingUser) {
				throw new Error("USER_ALREADY_EXISTS");
			}

			const passwordHash = await passwords.hash(input.password);
			const user = await users.createUser({ email, passwordHash });
			return { id: user.id, email: user.email };
		},
		async login(input) {
			const email = input.email.trim().toLowerCase();
			const user = await users.findByEmail(email);
			if (
				!user ||
				!(await passwords.verify(user.passwordHash, input.password))
			) {
				throw new Error("INVALID_CREDENTIALS");
			}

			const publicUser = { id: user.id, email: user.email };
			const refreshToken = tokens.signRefreshToken(user.id);
			await sessions.create({
				id: randomUUID(),
				tokenHash: tokenHasher.hash(refreshToken),
				userId: user.id,
			});

			return {
				user: publicUser,
				accessToken: tokens.signAccessToken(user.id),
				refreshToken,
			};
		},
		async refresh(refreshToken) {
			const userId = tokens.verifyRefreshToken(refreshToken);
			const currentTokenHash = tokenHasher.hash(refreshToken);
			const session = await sessions.getByHash(currentTokenHash);
			if (!session || session.userId !== userId) {
				throw new Error("INVALID_REFRESH_TOKEN");
			}

			const user = await users.findById(userId);
			if (!user) {
				throw new Error("INVALID_REFRESH_TOKEN");
			}

			const nextRefreshToken = tokens.signRefreshToken(user.id);
			const rotated = await sessions.rotate(
				currentTokenHash,
				tokenHasher.hash(nextRefreshToken),
				randomUUID(),
			);
			if (!rotated) {
				throw new Error("INVALID_REFRESH_TOKEN");
			}

			const publicUser = { id: user.id, email: user.email };
			return {
				user: publicUser,
				accessToken: tokens.signAccessToken(user.id),
				refreshToken: nextRefreshToken,
			};
		},
		async me(userId) {
			const user = await users.findById(userId);
			if (!user) {
				throw new Error("UNAUTHORIZED");
			}
			return { id: user.id, email: user.email };
		},
		async logout(refreshToken) {
			if (refreshToken) {
				await sessions.deleteByHash(tokenHasher.hash(refreshToken));
			}
		},
	};
}
