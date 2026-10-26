import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { adminExists, setAdmin } from "./services/authService.js";
import { ensureSeedData } from "./services/seedService.js";
import { mountWeb } from "./web.js";

async function main() {
  await connectDatabase();
  await ensureSeedData();

  // Development convenience: create the single admin from .env on first run.
  if (!env.isProduction && !(await adminExists()) && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await setAdmin({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    console.log(`[admin] created development admin ${process.env.ADMIN_EMAIL}`);
  }

  const app = createApp();
  await mountWeb(app);

  const server = app.listen(env.PORT, () => {
    console.log(`[web] The Music of Heart running at http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = async () => {
    server.close();
    await disconnectDatabase();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
