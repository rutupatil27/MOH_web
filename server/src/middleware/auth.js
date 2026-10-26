import { env } from "../config/env.js";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, verifySession } from "../services/authService.js";
import { HttpError } from "../utils/errors.js";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "strict",
  path: "/",
};

export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, { ...sessionCookieOptions, maxAge: SESSION_TTL_SECONDS * 1000 });
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
}

export async function requireAdmin(req, _res, next) {
  const admin = await verifySession(req.cookies?.[SESSION_COOKIE]);
  if (!admin) return next(new HttpError(401, "Please sign in to continue."));
  req.admin = admin;
  next();
}

/**
 * Defence in depth on top of SameSite=Strict: state-changing requests must
 * come from this site's own origin.
 */
export function sameOrigin(req, _res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (!origin) return next(new HttpError(403, "Request origin missing."));
  const host = req.get("host");
  let ok = false;
  try {
    const url = new URL(origin);
    ok = url.host === host || origin === new URL(env.SITE_URL).origin;
  } catch {
    ok = false;
  }
  return ok ? next() : next(new HttpError(403, "Cross-site request blocked."));
}
