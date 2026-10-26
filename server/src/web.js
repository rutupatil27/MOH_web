import path from "node:path";
import { pathToFileURL } from "node:url";

import { createRequestHandler } from "@react-router/express";
import express from "express";
import { rateLimit } from "express-rate-limit";

import { env } from "./config/env.js";

/**
 * The /enquire page action is rate-limited like POST /api/enquiries, but
 * instead of a JSON 429 it flags the request so the page can answer in place.
 */
const pageEnquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: env.isProduction ? 6 : 1000,
  standardHeaders: false,
  legacyHeaders: false,
  skip: (req) => req.method !== "POST" || !req.path.startsWith("/enquire"),
  handler: (req, _res, next) => {
    req.headers["x-moh-limited"] = "1";
    next();
  },
});

/**
 * Mounts the React Router site after the API. In development the client is
 * served through Vite's middleware with HMR; in production from client/build.
 */
export async function mountWeb(app) {
  app.use((req, _res, next) => {
    delete req.headers["x-moh-limited"];
    next();
  });
  app.use(pageEnquiryLimiter);

  if (!env.isProduction) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      root: env.clientRoot,
      configFile: path.join(env.clientRoot, "vite.config.js"),
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    app.use(
      createRequestHandler({
        build: () => vite.ssrLoadModule("virtual:react-router/server-build"),
        mode: "development",
      }),
    );
    return;
  }

  const buildDir = path.join(env.clientRoot, "build");
  app.use("/assets", express.static(path.join(buildDir, "client/assets"), { immutable: true, maxAge: "1y" }));
  app.use(express.static(path.join(buildDir, "client"), { maxAge: "1h", index: false }));
  const build = await import(pathToFileURL(path.join(buildDir, "server/index.js")).href);
  app.use(createRequestHandler({ build, mode: "production" }));
}
