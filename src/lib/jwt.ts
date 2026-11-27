import { createHash, randomUUID } from "node:crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface TokenConfig {
	accessSecret: string;
	refreshSecret: string;
}

export function hashRefreshToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}

export function createTokenService(config: TokenConfig) {
	function verifyToken(token: string, secret: string): JwtPayload {
		const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
		if (typeof payload === "string") {
			throw new Error("Invalid token payload");
		}
		return payload;
	}

	function getUserId(payload: JwtPayload): number {
		const userId = Number(payload.sub);
		if (!Number.isSafeInteger(userId) || userId <= 0) {
			throw new Error("Invalid token subject");
		}
		return userId;
	}

	return {
		signAccessToken(userId: number): string {
			return jwt.sign({}, config.accessSecret, {
				algorithm: "HS256",
				subject: String(userId),
				expiresIn: "15m",
			});
		},
		signRefreshToken(userId: number): string {
			return jwt.sign({ type: "refresh" }, config.refreshSecret, {
				algorithm: "HS256",
				subject: String(userId),
				expiresIn: "7d",
				jwtid: randomUUID(),
			});
		},
		verifyAccessToken(token: string): number {
			try {
				return getUserId(verifyToken(token, config.accessSecret));
			} catch {
				throw new Error("INVALID_ACCESS_TOKEN");
			}
		},
		verifyRefreshToken(token: string): number {
			try {
				const payload = verifyToken(token, config.refreshSecret);
				if (payload.type !== "refresh") {
					throw new Error("Invalid token type");
				}
				return getUserId(payload);
			} catch {
				throw new Error("INVALID_REFRESH_TOKEN");
			}
		},
	};
}
