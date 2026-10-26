import path from "node:path";
import { fileURLToPath } from "node:url";

import { z } from "zod";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    SITE_URL: z.url().default("https://themusicofheart.com"),
    MONGODB_URI: z.string().default(""),
    JWT_SECRET: z.string().default(""),
    TRUST_PROXY: z.string().default(""),
    STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
    UPLOAD_DIR: z.string().default(path.join(serverRoot, "uploads")),
    MEDIA_BASE_URL: z.string().default("/uploads"),
    S3_BUCKET: z.string().default(""),
    S3_REGION: z.string().default("auto"),
    S3_ENDPOINT: z.string().default(""),
    S3_ACCESS_KEY_ID: z.string().default(""),
    S3_SECRET_ACCESS_KEY: z.string().default(""),
    DEV_DB_DIR: z.string().default(path.join(serverRoot, ".data", "db")),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== "production") return;
    if (!env.MONGODB_URI) ctx.addIssue({ code: "custom", path: ["MONGODB_URI"], message: "is required in production" });
    if (env.JWT_SECRET.length < 32)
      ctx.addIssue({ code: "custom", path: ["JWT_SECRET"], message: "must be at least 32 characters in production" });
    if (env.STORAGE_DRIVER === "s3" && !(env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY))
      ctx.addIssue({ code: "custom", path: ["S3_BUCKET"], message: "S3 storage needs bucket and credentials" });
  });

function load() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`);
    throw new Error(`Invalid environment configuration:\n${lines.join("\n")}`);
  }
  const env = parsed.data;
  // Development gets a throwaway secret so the app runs out of the box; production never does.
  if (!env.JWT_SECRET) env.JWT_SECRET = "development-only-secret-change-me-0123456789";
  env.SITE_URL = env.SITE_URL.replace(/\/+$/, "");
  return Object.freeze({
    ...env,
    isProduction: env.NODE_ENV === "production",
    isTest: env.NODE_ENV === "test",
    serverRoot,
    clientRoot: path.resolve(serverRoot, "../client"),
  });
}

export const env = load();
