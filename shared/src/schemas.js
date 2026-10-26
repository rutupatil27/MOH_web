import { z } from "zod";

import {
  CONTACT_METHOD_VALUES,
  DEFAULT_PHOTO_ALT,
  ENQUIRY_STATUS_VALUES,
  LEVEL_VALUES,
  LIMITS,
  SLUG_PATTERN,
  UNDECIDED,
} from "./constants.js";
import { normalizeIndianMobile } from "./phone.js";

const text = (max, label) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`);

const requiredText = (max, label, min = 1) => {
  const schema = text(max, label).min(1, `${label} is required.`);
  return min > 1 ? schema.min(min, `${label} must be at least ${min} characters.`) : schema;
};

const optionalUrl = (label) =>
  z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https:\/\/[^\s]+$/i.test(v), `${label} must be a full https:// link.`)
    .default("");

const mobile = z
  .string({ error: "Phone number is required." })
  .trim()
  .min(1, "Phone number is required.")
  .transform((value, ctx) => {
    const normalized = normalizeIndianMobile(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a 10-digit Indian mobile number, e.g. 98765 43210." });
      return z.NEVER;
    }
    return normalized;
  });

/** Checkbox / string booleans coming from forms, plus real booleans from JSON. */
const boolish = z.preprocess((v) => v === true || v === "true" || v === "on" || v === "1", z.boolean());

/* ---------- Public: enquiry ---------- */

export const enquirySchema = z.object({
  name: requiredText(LIMITS.name, "Name", 2),
  phone: mobile,
  course: z
    .string({ error: "Choose a course." })
    .trim()
    .min(1, "Choose a course.")
    .refine((v) => v === UNDECIDED || SLUG_PATTERN.test(v), "Choose a course."),
  level: z.enum([...LEVEL_VALUES, UNDECIDED], { error: "Choose a level." }),
  preferredContact: z.enum(CONTACT_METHOD_VALUES, { error: "Choose how we should contact you." }),
  message: text(LIMITS.message, "Message").default(""),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(200).optional().default(""),
});

/* ---------- Admin ---------- */

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Password is required.").max(200),
});

const levelContentSchema = z.object({
  level: z.enum(LEVEL_VALUES),
  summary: text(LIMITS.shortText * 3, "Level summary").default(""),
  points: z.array(requiredText(LIMITS.shortText, "Point")).max(12).default([]),
});

export const courseSchema = z.object({
  name: requiredText(60, "Course name", 2),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(SLUG_PATTERN, "Slug may contain lowercase letters, numbers and single dashes."),
  shortDescription: requiredText(LIMITS.shortText, "Short description"),
  description: text(LIMITS.longText, "Description").default(""),
  levels: z
    .array(levelContentSchema)
    .min(1, "Keep at least one level.")
    .refine((levels) => new Set(levels.map((l) => l.level)).size === levels.length, "Each level can appear once."),
  featured: boolish.default(false),
  published: boolish.default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const galleryItemSchema = z.object({
  title: text(120, "Title").default(""),
  // Optional: a blank description falls back to the academy-wide default.
  altText: text(200, "Alt text")
    .optional()
    .transform((v) => v || DEFAULT_PHOTO_ALT),
  category: text(40, "Category").default(""),
  published: boolish.default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export const enquiryUpdateSchema = z.object({
  status: z.enum(ENQUIRY_STATUS_VALUES).optional(),
  adminNote: text(LIMITS.adminNote, "Note").optional(),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().regex(/^[a-f0-9]{24}$/)).min(1).max(500),
});

export const siteSettingsSchema = z.object({
  academyName: requiredText(100, "Academy name", 2),
  founderName: text(100, "Founder name").default(""),
  founderBio: text(600, "Founder bio").default(""),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || normalizeIndianMobile(v) !== null, "Enter a 10-digit Indian mobile number.")
    .transform((v) => (v === "" ? "" : normalizeIndianMobile(v)))
    .default(""),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address.")
    .default(""),
  address: z
    .object({
      line1: text(120, "Address line 1").default(""),
      line2: text(120, "Address line 2").default(""),
      locality: text(80, "Locality").default(""),
      city: text(60, "City").default(""),
      region: text(60, "State").default(""),
      postalCode: z
        .string()
        .trim()
        .refine((v) => v === "" || /^\d{6}$/.test(v), "PIN code must be 6 digits.")
        .default(""),
    })
    .default({}),
  instagramUrl: optionalUrl("Instagram link"),
  youtubeUrl: optionalUrl("YouTube link"),
  mapsUrl: optionalUrl("Google Maps link"),
  hours: text(200, "Opening hours").default(""),
  seo: z
    .object({
      title: text(70, "SEO title").default(""),
      description: text(170, "SEO description").default(""),
    })
    .default({}),
});

/**
 * Flatten a ZodError into { fieldPath: firstMessage } for forms and API replies.
 * Nested paths are joined with dots ("address.postalCode", "levels.0.summary").
 */
export function fieldErrors(error) {
  const out = {};
  for (const issue of error?.issues ?? []) {
    const key = issue.path.length ? issue.path.join(".") : "_form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
