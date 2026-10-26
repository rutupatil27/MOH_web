import { siteSettingsSchema } from "@moh/shared";

import { SiteSettings } from "../models/index.js";
import { unprocessable } from "../utils/errors.js";
import { clean } from "../utils/serialize.js";
import { fieldErrorsOf } from "../utils/validation.js";

/**
 * Confirmed facts only (docs/01-class-data.md). Everything still unknown —
 * email, YouTube, Maps, hours — starts empty and renders nowhere until the
 * admin fills it in.
 */
export const DEFAULT_SETTINGS = {
  academyName: "The Music of Heart Music Academy",
  founderName: "Mr. Aryan Tisawar",
  // Approved by the owner on 2026-10-21.
  founderBio:
    "A passionate musician and educator dedicated to helping students build strong musical foundations and express themselves through music.",
  phone: "+918552829977",
  email: "",
  address: {
    line1: "Flat No. 313, Rajan Complex, beside Rajkamal Sweets",
    line2: "Datta Mandir Road, Gayakhe Colony",
    locality: "Nashik Road",
    city: "Nashik",
    region: "Maharashtra",
    postalCode: "422101",
  },
  instagramUrl: "https://www.instagram.com/the_musicofheart/",
  youtubeUrl: "",
  mapsUrl: "",
  hours: "",
  seo: { title: "", description: "" },
};

export async function getSettings() {
  const doc = await SiteSettings.findOne({ key: "site" }).lean();
  return doc ? clean(doc) : { id: null, ...DEFAULT_SETTINGS };
}

export async function updateSettings(input) {
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) throw unprocessable(fieldErrorsOf(parsed.error));
  const doc = await SiteSettings.findOneAndUpdate(
    { key: "site" },
    { $set: parsed.data },
    { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true },
  ).lean();
  return clean(doc);
}

export async function ensureSettings() {
  const exists = await SiteSettings.exists({ key: "site" });
  if (!exists) {
    await SiteSettings.create({ key: "site", ...DEFAULT_SETTINGS });
    return;
  }
  // Fields added after launch get their confirmed default once, without touching admin edits.
  await SiteSettings.updateOne({ key: "site", founderBio: { $exists: false } }, { $set: { founderBio: DEFAULT_SETTINGS.founderBio } });
}
