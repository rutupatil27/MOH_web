import multer from "multer";

import { env } from "../config/env.js";
import { HttpError } from "../utils/errors.js";

export function apiNotFound(_req, res) {
  res.status(404).json({ error: "Not found." });
}

// eslint-disable-next-line no-unused-vars
export function apiErrorHandler(err, req, res, _next) {
  if (err instanceof multer.MulterError) {
    const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message = err.code === "LIMIT_FILE_SIZE" ? "That photo is larger than 12 MB." : "Upload one photo at a time.";
    return res.status(status).json({ error: message });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "The request body is not valid JSON." });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...(err.details ?? {}) });
  }
  if (!env.isTest) console.error(`[api] ${req.method} ${req.originalUrl}`, err);
  res.status(500).json({ error: "Something went wrong on our side. Please try again." });
}
