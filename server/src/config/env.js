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
    STORAGE_DRIVER: z.enum(["local", "s3", "cloudinary"]).default("local"),
    UPLOAD_DIR: z.string().default(path.join(serverRoot, "uploads")),
    MEDIA_BASE_URL: z.string().default("/uploads"),
    S3_BUCKET: z.string().default(""),
    S3_REGION: z.string().default("auto"),
    S3_ENDPOINT: z.string().default(""),
    S3_ACCESS_KEY_ID: z.string().default(""),
    S3_SECRET_ACCESS_KEY: z.string().default(""),
    // cloudinary://<api_key>:<api_secret>@<cloud_name> — the "API environment variable" in the Cloudinary console
    CLOUDINARY_URL: z.string().default(""),
    DEV_DB_DIR: z.string().default(path.join(serverRoot, ".data", "db")),
  })
  .superRefine((env, ctx) => {
    if (env.STORAGE_DRIVER === "cloudinary" && !parseCloudinaryUrl(env.CLOUDINARY_URL))
      ctx.addIssue({
        code: "custom",
        path: ["CLOUDINARY_URL"],
        message: "must look like cloudinary://<api_key>:<api_secret>@<cloud_name>",
      });
    if (env.NODE_ENV !== "production") return;
    if (!env.MONGODB_URI) ctx.addIssue({ code: "custom", path: ["MONGODB_URI"], message: "is required in production" });
    if (env.JWT_SECRET.length < 32)
      ctx.addIssue({ code: "custom", path: ["JWT_SECRET"], message: "must be at least 32 characters in production" });
    if (env.STORAGE_DRIVER === "s3" && !(env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY))
      ctx.addIssue({ code: "custom", path: ["S3_BUCKET"], message: "S3 storage needs bucket and credentials" });
  });

function parseCloudinaryUrl(value) {
  const match = /^cloudinary:\/\/([^:@\s]+):([^@\s]+)@([\w-]+)\/?$/.exec(value.trim());
  if (!match || match[2].startsWith("<")) return null;
  return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
}

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
  const cloudinary = env.STORAGE_DRIVER === "cloudinary" ? parseCloudinaryUrl(env.CLOUDINARY_URL) : null;
  // Images are served from Cloudinary's CDN; the content security policy allows this origin.
  if (cloudinary) env.MEDIA_BASE_URL = `https://res.cloudinary.com/${cloudinary.cloudName}`;
  return Object.freeze({
    ...env,
    cloudinary,
    isProduction: env.NODE_ENV === "production",
    isTest: env.NODE_ENV === "test",
    serverRoot,
    clientRoot: path.resolve(serverRoot, "../client"),
  });
}

export const env = load();
