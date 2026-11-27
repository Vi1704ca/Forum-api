import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

// URL передається під час збирання застосунку, а не читається в репозиторіях.
export function createDb(url: string) {
	return postgres<Contract>({ contractJson, url });
}

export type Database = ReturnType<typeof createDb>;
