import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    category: { type: String, trim: true, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    verificationSupport: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Certification = mongoose.model("Certification", certificationSchema);
