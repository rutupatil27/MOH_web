import mongoose from "mongoose";

import { mediaSchema } from "./media.js";

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    altText: { type: String, required: true },
    category: { type: String, default: "" },
    image: { type: mediaSchema, required: true },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

galleryItemSchema.index({ published: 1, sortOrder: 1, createdAt: -1 });

export const GalleryItem = mongoose.models.GalleryItem ?? mongoose.model("GalleryItem", galleryItemSchema);
