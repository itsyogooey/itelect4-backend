import { model, Schema } from "mongoose";
import type { LocationDoc } from "../types/index.js";

// Reference data. A location belongs to nobody, so its routes need no token.
const locationSchema = new Schema<LocationDoc>({
  // unique is why GET /api/locations/MB can use findOne safely.
  code: {
    type: String,
    required: [true, "code is required"],
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: { type: String, required: [true, "name is required"], trim: true },
});

// No id to rename: the code is the identity. Only remove what Mongo added.
locationSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const LocationModel = model<LocationDoc>("Location", locationSchema);
