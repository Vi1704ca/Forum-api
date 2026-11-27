import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { createDb } from "./prisma/db.js";
import { createAuthModule } from "./modules/auth.js";
import { createCategoryModule } from "./modules/category.js";
import { createPostModule } from "./modules/post.js";

const db = createDb(config.databaseUrl);
const app = express();
const authModule = createAuthModule(db, config.jwt);

app.use(
	cors({
		origin: config.corsOrigins,
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.json());
app.use("/categories", createCategoryModule(db));
app.use("/posts", createPostModule(db, authModule.requireAuth));
app.use("/auth", authModule.router);
app.use("/", authModule.router);

app.listen(config.port, config.host, () => {
	console.log(`API listening at http://${config.host}:${config.port}`);
});
