import "dotenv/config";
import { definePrismaConfig } from "@prisma/cli-engine";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

function required(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`${name} is not defined`);
	}
	return value;
}

export default definePrismaConfig({
	orm: ormConfig({
		contract: "./src/prisma/contract.prisma",
		db: {
			connection: required("DATABASE_URL"),
		},
	}),
});
