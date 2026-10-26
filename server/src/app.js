import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { apiErrorHandler, apiNotFound } from "./middleware/errors.js";
import { apiLimiter } from "./middleware/rateLimits.js";
import { adminRouter } from "./routes/admin.js";
import { publicRouter } from "./routes/public.js";

function contentSecurityPolicy() {
  if (!env.isProduction) return false;
  const media = env.MEDIA_BASE_URL.startsWith("http") ? new URL(env.MEDIA_BASE_URL).origin : null;
  return {
    useDefaults: false,
    directives: {
      "default-src": ["'self'"],
      // React Router inlines its hydration data; no third-party scripts are loaded.
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "blob:", ...(media ? [media] : [])],
      "font-src": ["'self'"],
      "connect-src": ["'self'"],
      "frame-ancestors": ["'none'"],
      "form-action": ["'self'"],
      "base-uri": ["'self'"],
      "object-src": ["'none'"],
      // Only behind HTTPS; on a plain-http preview it would break every asset URL.
      ...(env.SITE_URL.startsWith("https://") ? { "upgrade-insecure-requests": [] } : {}),
    },
  };
}

/** The Express app without the page renderer — used directly by API tests. */
export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  if (env.TRUST_PROXY) app.set("trust proxy", Number(env.TRUST_PROXY) || env.TRUST_PROXY);

  app.use(
    helmet({
      contentSecurityPolicy: contentSecurityPolicy(),
      crossOriginEmbedderPolicy: false,
      // "no-referrer" makes browsers send `Origin: null` on our own form posts,
      // which (correctly) fails React Router's and the admin API's origin checks.
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      strictTransportSecurity: env.isProduction,
    }),
  );
  app.use(compression());
  app.use(cookieParser());

  // Body parsers are scoped to /api so React Router actions read their own request bodies.
  const api = express.Router();
  api.use(apiLimiter);
  api.use(express.json({ limit: "100kb" }));
  api.use("/admin", adminRouter);
  api.use(publicRouter);
  api.use(apiNotFound);
  api.use(apiErrorHandler);
  app.use("/api", api);

  if (env.STORAGE_DRIVER === "local") {
    app.use("/uploads", express.static(env.UPLOAD_DIR, { immutable: true, maxAge: "1y", fallthrough: false }));
  }

  return app;
}
