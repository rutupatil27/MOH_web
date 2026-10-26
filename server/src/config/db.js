import fs from "node:fs/promises";

import mongoose from "mongoose";

import { env } from "./env.js";

let memoryServer = null;

/**
 * Connects to MONGODB_URI. In development without a URI, starts a local
 * MongoDB (mongodb-memory-server) whose data persists in server/.data so the
 * site runs with no database install.
 */
export async function connectDatabase(uri = env.MONGODB_URI) {
  mongoose.set("strictQuery", true);
  let target = uri;

  if (!target) {
    if (env.isProduction) throw new Error("MONGODB_URI is required in production.");
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    await fs.mkdir(env.DEV_DB_DIR, { recursive: true });
    memoryServer = await MongoMemoryServer.create({
      binary: { version: "8.2.6" },
      instance: { dbPath: env.DEV_DB_DIR, storageEngine: "wiredTiger", port: 27027 },
    });
    target = memoryServer.getUri("moh");
    console.log(`[db] local development MongoDB at ${target} (data in ${env.DEV_DB_DIR})`);
  }

  await mongoose.connect(target, { serverSelectionTimeoutMS: 10_000 });
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop({ doCleanup: false });
    memoryServer = null;
  }
}
