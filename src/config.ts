import "dotenv/config";

function required(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`${name} is not defined`);
	}
	return value;
}

function positiveInt(name: string, fallback: number): number {
	const raw = process.env[name];
	if (raw === undefined || raw === "") {
		return fallback;
	}

	const value = Number(raw);
	if (!Number.isSafeInteger(value) || value <= 0) {
		throw new Error(`${name} must be a positive integer`);
	}
	return value;
}

const defaultCorsOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

function getCorsOrigins(): string[] {
	const rawOrigins = process.env.CORS_ORIGINS;
	if (rawOrigins === undefined) {
		return defaultCorsOrigins;
	}

	const origins = rawOrigins
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);
	if (origins.length === 0) {
		throw new Error("CORS_ORIGINS must contain at least one origin");
	}
	return origins;
}

export const config = {
	host: process.env.HOST ?? "localhost",
	port: positiveInt("PORT", 3000),
	corsOrigins: getCorsOrigins(),
	databaseUrl: required("DATABASE_URL"),
	jwt: {
		accessSecret: required("JWT_ACCESS_SECRET"),
		refreshSecret: required("JWT_REFRESH_SECRET"),
	},
} as const;

export type AppConfig = typeof config;
