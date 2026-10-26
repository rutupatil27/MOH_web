import mongoose from "mongoose";

import { LEVEL_VALUES } from "@moh/shared";

import { mediaSchema } from "./media.js";

const levelSchema = new mongoose.Schema(
  {
    level: { type: String, enum: LEVEL_VALUES, required: true },
    summary: { type: String, default: "" },
    points: { type: [String], default: [] },
  },
  { _id: false },
);

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, default: "" },
    levels: { type: [levelSchema], default: [] },
    image: { type: mediaSchema, default: null },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

courseSchema.index({ published: 1, sortOrder: 1 });

export const Course = mongoose.models.Course ?? mongoose.model("Course", courseSchema);
