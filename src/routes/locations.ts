import { Router } from "express";
import { LocationModel } from "../models/Location.js";

export const locationRouter = Router();

// There is no requireAuth in this file on purpose: the location list is
// public, unlike /api/items which is private.

// GET /api/locations
locationRouter.get("/", async (_req, res) => {
  const locations = await LocationModel.find().sort({ code: 1 });
  res.json(locations);
});

// GET /api/locations/mb  -> one object, not an array
locationRouter.get("/:code", async (req, res) => {
  // The schema stores codes upper-cased, so raise the URL value too.
  const location = await LocationModel.findOne({ code: req.params.code.toUpperCase() });

  if (!location) {
    res.status(404).json({ message: `No location with code "${req.params.code}"` });
    return;
  }

  res.json(location);
});
