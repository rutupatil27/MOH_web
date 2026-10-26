/**
 * Prepares a photo in the browser before upload. Large photos are scaled to the
 * site's largest display size (the server never serves wider than 3200px), and
 * formats the server cannot read but the browser can — iPhone HEIC in Safari —
 * become JPEG. Uploads get small and fast on mobile data; the server still
 * validates and processes every file. If the browser cannot decode the file, the
 * original is sent unchanged and the server explains what to do.
 */
const MAX_EDGE = 3200; // matches the server's largest variant
const JPEG_QUALITY = 0.95; // the server re-encodes, so keep this step close to lossless
const SEND_AS_IS = new Set(["image/jpeg", "image/png", "image/webp"]);
const SMALL_ENOUGH = 3 * 1024 * 1024;

export const PHOTO_ACCEPT = "image/*,.heic,.heif";

export async function prepareImage(file) {
  if (!(file instanceof File) || !file.size) return file;
  if (SEND_AS_IS.has(file.type) && file.size <= SMALL_ENOUGH) return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    // JPEG has no transparency; a light ground keeps cut-out PNGs from turning black.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    // Browsers default to fast, jagged downscaling; "high" keeps fine detail such as strings and text.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob) return file;
    // Keep the original if re-encoding would not make it smaller and it is already a format the server reads.
    if (SEND_AS_IS.has(file.type) && blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: file.lastModified });
  } finally {
    bitmap.close?.();
  }
}
