import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import type { ErrorRequestHandler } from "express";
import { authRouter } from "./routes/auth.js";
import { itemRouter } from "./routes/items.js";
import { courseRouter } from "./routes/courses.js";
import { connectDB } from "./config/db.js";

export const app = express();

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin !== "");

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);
app.use("/api/courses", courseRouter);

app.use((req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
});

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((validationError) => validationError.message),
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `"${err.value}" is not a valid id` });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};

app.use(errorHandler);

export default app;