import { rateLimit } from "express-rate-limit";

import { env } from "../config/env.js";

const json = (message) => (_req, res) => res.status(429).json({ error: message });

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.isProduction ? 8 : 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: json("Too many sign-in attempts. Please wait 15 minutes and try again."),
});

export const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: env.isProduction ? 6 : 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: json("You have sent several enquiries already. Please call us instead, or try again in an hour."),
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: env.isProduction ? 300 : 10_000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: json("Too many requests. Please slow down."),
});
