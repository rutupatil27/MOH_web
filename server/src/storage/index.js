import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { env } from "../config/env.js";

/**
 * Storage drivers share one interface:
 *   put(key, buffer, contentType) → public URL
 *   removePrefix(prefix)
 * Keys look like "gallery/<id>/960.webp". Local disk in development; in
 * production any S3-compatible bucket (e.g. Cloudflare R2) or Cloudinary.
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

/**
 * Cloudinary through its REST API. Variants are already WebP from sharp, so
 * they are stored and delivered as-is — no Cloudinary transformations are used.
 */
function cloudinaryDriver() {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  const api = `https://api.cloudinary.com/v1_1/${cloudName}`;

  async function call(response) {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Cloudinary ${response.status}: ${body.error?.message ?? "request failed"}`);
    return body;
  }

  return {
    async put(key, buffer, contentType) {
      // "gallery/<id>/960.webp" → public id "gallery/<id>/960"; the format comes from the file.
      const params = { public_id: key.replace(/\.[a-z0-9]+$/i, ""), timestamp: Math.floor(Date.now() / 1000) };
      const toSign = Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&");
      const form = new FormData();
      for (const [k, v] of Object.entries(params)) form.append(k, String(v));
      form.append("api_key", apiKey);
      form.append("signature", crypto.createHash("sha1").update(toSign + apiSecret).digest("hex"));
      form.append("file", new Blob([buffer], { type: contentType }), path.basename(key));
      const uploaded = await call(await fetch(`${api}/image/upload`, { method: "POST", body: form }));
      return uploaded.secure_url;
    },
    async removePrefix(prefix) {
      const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
      const query = new URLSearchParams({ prefix: `${prefix.replace(/\/+$/, "")}/` });
      await call(
        await fetch(`${api}/resources/image/upload?${query}`, {
          method: "DELETE",
          headers: { Authorization: `Basic ${auth}` },
        }),
      );
    },
  };
}

let driver;
export async function storage() {
  if (!driver) {
    if (env.STORAGE_DRIVER === "s3") driver = await s3Driver();
    else if (env.STORAGE_DRIVER === "cloudinary") driver = cloudinaryDriver();
    else driver = localDriver();
  }
  return driver;
}
