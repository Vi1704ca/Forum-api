// Описую userId, який middleware записує після перевірки access-токена.
declare global {
	namespace Express {
		interface Locals {
			userId?: number;
		}
	}
}

export {};
