import fs from "node:fs/promises";
import path from "node:path";

import { env } from "../config/env.js";

/**
 * Storage drivers share one interface:
 *   put(key, buffer, contentType) → public URL
 *   removePrefix(prefix)
 * Keys look like "gallery/<id>/960.webp". Local disk in development,
 * any S3-compatible bucket (e.g. Cloudflare R2) in production.
 */

function localDriver() {
  const root = env.UPLOAD_DIR;
  const base = env.MEDIA_BASE_URL.replace(/\/+$/, "");
  return {
    async put(key, buffer) {
      const file = path.join(root, key);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, buffer);
      return `${base}/${key}`;
    },
    async removePrefix(prefix) {
      const target = path.join(root, prefix);
      if (!target.startsWith(root)) return;
      await fs.rm(target, { recursive: true, force: true });
    },
  };
}

async function s3Driver() {
  const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = await import(
    "@aws-sdk/client-s3"
  );
  const client = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT || undefined,
    credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
  });
  const base = env.MEDIA_BASE_URL.replace(/\/+$/, "");
  return {
    async put(key, buffer, contentType) {
      await client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
      return `${base}/${key}`;
    },
    async removePrefix(prefix) {
      const listed = await client.send(new ListObjectsV2Command({ Bucket: env.S3_BUCKET, Prefix: prefix }));
      const objects = (listed.Contents ?? []).map((o) => ({ Key: o.Key }));
      if (objects.length) {
        await client.send(new DeleteObjectsCommand({ Bucket: env.S3_BUCKET, Delete: { Objects: objects } }));
      }
    },
  };
}

let driver;
export async function storage() {
  driver ??= env.STORAGE_DRIVER === "s3" ? await s3Driver() : localDriver();
  return driver;
}
