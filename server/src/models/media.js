import mongoose from "mongoose";

/** A processed image: responsive WebP variants plus a tiny blurred placeholder. */
export const mediaSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    placeholder: { type: String, default: "" },
    variants: [
      {
        _id: false,
        width: { type: Number, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { _id: false },
);
