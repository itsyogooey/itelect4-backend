import type { LocationDoc } from "../types/index.js";

// The three campus locations my db.json items used. They go into the
// database once, from src/seed.ts. Nobody creates a location through the API.
export const LOCATIONS: LocationDoc[] = [
  { code: "CBEAM", name: "CBEAM" },
  { code: "LIB", name: "Library" },
  { code: "MB", name: "MB Building" },
];
