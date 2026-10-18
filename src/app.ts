import "dotenv/config";
import express from "express";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { itemRouter } from "./routes/items.js";
import { locationRouter } from "./routes/locations.js";

export const app = express();

// ===== SESSION 9: app.use(cors()) -- every website could call this API =====
// ===== SESSION 10: only the origins listed in CORS_ORIGIN (comma-separated) =====
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin !== "");

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// On Vercel there is no startup step, so wait for the database here,
// in front of every route.
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/locations", locationRouter);
app.use("/api/items", itemRouter);

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

// Vercel looks for an Express app in src/app.ts and needs a default export.
// That is the whole deployment configuration -- no vercel.json.
export default app;
