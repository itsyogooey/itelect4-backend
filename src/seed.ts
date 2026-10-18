import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Course } from "./models/Course.js";
import { COURSES } from "./data/courses.js";

try {
  await connectDB();
  for (const course of COURSES) {
    await Course.updateOne({ code: course.code }, course, { upsert: true });
  }
  console.log(`${COURSES.length} courses in ${mongoose.connection.name}`);
  await mongoose.disconnect();
} catch (error: unknown) {
  console.error(error);
  process.exit(1);
}
