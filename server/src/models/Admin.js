import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

adminSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export const Admin = mongoose.models.Admin ?? mongoose.model("Admin", adminSchema);
