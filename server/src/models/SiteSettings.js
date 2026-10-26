import mongoose from "mongoose";

/** Singleton document (key: "site") holding the admin-managed public facts. */
const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },
    academyName: { type: String, required: true },
    founderName: { type: String, default: "" },
    founderBio: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      locality: { type: String, default: "" },
      city: { type: String, default: "" },
      region: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },
    instagramUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    mapsUrl: { type: String, default: "" },
    hours: { type: String, default: "" },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

export const SiteSettings = mongoose.models.SiteSettings ?? mongoose.model("SiteSettings", siteSettingsSchema);
