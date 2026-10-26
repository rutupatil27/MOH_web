import mongoose from "mongoose";

import { CONTACT_METHOD_VALUES, ENQUIRY_STATUS_VALUES, LEVEL_VALUES, UNDECIDED } from "@moh/shared";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    courseName: { type: String, default: "" },
    level: { type: String, enum: [...LEVEL_VALUES, UNDECIDED], required: true },
    preferredContact: { type: String, enum: CONTACT_METHOD_VALUES, required: true },
    message: { type: String, default: "" },
    status: { type: String, enum: ENQUIRY_STATUS_VALUES, default: "new" },
    adminNote: { type: String, default: "" },
    source: { type: String, default: "" },
  },
  { timestamps: true },
);

enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ createdAt: -1 });

export const Enquiry = mongoose.models.Enquiry ?? mongoose.model("Enquiry", enquirySchema);
