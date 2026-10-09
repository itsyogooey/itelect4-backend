import { model, Schema } from "mongoose";
import type { ItemDoc } from "../types/index.js";

const itemSchema = new Schema<ItemDoc>({
  title: { type: String, required: [true, "Title is required"], trim: true },
  status: {
    type: String,
    enum: { values: ["lost", "found", "claimed"], message: "Status must be lost, found, or claimed" },
    default: "lost",
  },
  reward: {
    type: Number,
    min: [0, "Reward must be at least 0"],
    max: [10000, "Reward cannot exceed 10000"],
  },
  createdAt: { type: Date, default: Date.now },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Owner is required"] },
});

itemSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const ItemModel = model<ItemDoc>("Item", itemSchema);