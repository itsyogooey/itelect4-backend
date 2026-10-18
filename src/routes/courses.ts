import { Router } from "express";
import { Course } from "../models/Course.js";

export const courseRouter = Router();

courseRouter.get("/", async (_req, res) => {
  const courses = await Course.find().sort({ code: 1 });
  res.json(courses);
});

courseRouter.get<{ code: string }>("/:code", async (req, res) => {
  const course = await Course.findOne({ code: req.params.code.toUpperCase() });
  if (!course) {
    res.status(404).json({ message: `No course with code "${req.params.code}"` });
    return;
  }
  res.json(course);
});
