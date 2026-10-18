import { model, Schema } from "mongoose";
import type { CourseDoc } from "../types/index.js";

const courseSchema = new Schema<CourseDoc>({
  code: {
    type: String,
    required: [true, "Course code is required"],
    unique: true,
    uppercase: true,
    trim: true,
  },
  title: { type: String, required: [true, "Course title is required"], trim: true },
  units: {
    type: Number,
    required: [true, "Course units are required"],
    min: [1, "Course units must be at least 1"],
    max: [6, "Course units cannot exceed 6"],
  },
  semester: { type: String, required: [true, "Semester is required"], trim: true },
});

courseSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Course = model<CourseDoc>("Course", courseSchema);
