import crypto from "node:crypto";

import sharp from "sharp";

import { storage } from "../storage/index.js";
import { HttpError } from "../utils/errors.js";

const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "heif"]);
const TARGET_WIDTHS = [480, 960, 1600, 2400];

/**
 * Validates an uploaded image by its decoded content (never the filename),
 * strips metadata, fixes orientation, and stores responsive WebP variants
 * plus a ~20px blurred placeholder for layout-stable lazy loading.
 */
export async function processImage(buffer, folder) {
  let meta;
  try {
    meta = await sharp(buffer, { failOn: "error" }).metadata();
  } catch {
    throw new HttpError(415, "That file is not a readable image. Upload a JPEG, PNG, WebP or HEIC photo.");
  }
  if (!ACCEPTED_FORMATS.has(meta.format)) {
    throw new HttpError(415, "Upload a JPEG, PNG, WebP or HEIC photo.");
  }

  const base = sharp(buffer, { failOn: "error" }).rotate();
  const { width, height } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  if (width < 400 || height < 300) {
    throw new HttpError(422, "This photo is too small. Use an image at least 400 × 300 pixels.");
  }

  const key = `${folder}/${crypto.randomUUID()}`;
  const store = await storage();
  const widths = TARGET_WIDTHS.filter((w) => w < width).concat(Math.min(width, 2400));
  const unique = [...new Set(widths)].sort((a, b) => a - b);

  const variants = [];
  for (const w of unique) {
    const out = await base.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const url = await store.put(`${key}/${w}.webp`, out, "image/webp");
    variants.push({ width: w, url });
  }

  const tiny = await base.clone().resize({ width: 20 }).blur(1.2).webp({ quality: 40 }).toBuffer();

  return {
    key,
    width,
    height,
    placeholder: `data:image/webp;base64,${tiny.toString("base64")}`,
    variants,
  };
}

export async function removeImage(media) {
  if (!media?.key) return;
  const store = await storage();
  await store.removePrefix(media.key);
}
