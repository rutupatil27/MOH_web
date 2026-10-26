import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { loginSchema } from "@moh/shared";

import { env } from "../config/env.js";
import { Admin } from "../models/index.js";
import { HttpError } from "../utils/errors.js";
import { clean } from "../utils/serialize.js";
import { parseOrThrow } from "../utils/validation.js";

export const SESSION_COOKIE = "moh_admin";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

// Compared against when the email is unknown, so timing does not reveal which emails exist.
let dummyHash;
const getDummyHash = async () => (dummyHash ??= await bcrypt.hash("unused-placeholder-password", 12));

export async function login(input) {
  const { email, password } = parseOrThrow(loginSchema, input);
  const admin = await Admin.findOne({ email }).select("+passwordHash").lean();
  const ok = await bcrypt.compare(password, admin?.passwordHash ?? (await getDummyHash()));
  if (!admin || !ok) throw new HttpError(401, "That email and password do not match.");

  await Admin.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });
  const token = jwt.sign({ sub: String(admin._id) }, env.JWT_SECRET, {
    expiresIn: SESSION_TTL_SECONDS,
    issuer: "moh",
    audience: "moh-admin",
  });
  return { token, admin: clean({ ...admin, passwordHash: undefined }) };
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { issuer: "moh", audience: "moh-admin" });
    const admin = await Admin.findById(payload.sub).lean();
    return admin ? clean(admin) : null;
  } catch {
    return null;
  }
}

/**
 * There is exactly one admin. Creating one replaces any existing account,
 * which is also how the password is reset (via the CLI, never over HTTP).
 */
export async function setAdmin({ email, password }) {
  const parsed = parseOrThrow(loginSchema, { email, password });
  if (password.length < 12) throw new HttpError(422, "Use a password of at least 12 characters.");
  const passwordHash = await bcrypt.hash(parsed.password, 12);
  await Admin.deleteMany({ email: { $ne: parsed.email } });
  await Admin.updateOne({ email: parsed.email }, { $set: { email: parsed.email, passwordHash } }, { upsert: true });
  return { email: parsed.email };
}

export const adminExists = () => Admin.exists({});
