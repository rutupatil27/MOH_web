import multer from "multer";

import { LIMITS } from "@moh/shared";

import { HttpError } from "../utils/errors.js";

const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"]);

/** One image per request, held in memory; content is re-validated by sharp. */
export const singleImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LIMITS.uploadBytes, files: 1, fields: 10 },
  fileFilter(_req, file, cb) {
    if (ACCEPTED.has(file.mimetype)) cb(null, true);
    else cb(new HttpError(415, "Upload a JPEG, PNG or WebP photo."));
  },
}).single("image");

export function requireFile(req, _res, next) {
  if (!req.file) return next(new HttpError(422, "Choose a photo to upload.", { fields: { image: "Choose a photo to upload." } }));
  next();
}
