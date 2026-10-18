import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { LocationModel } from "./models/Location.js";
import { LOCATIONS } from "./data/locations.js";

// npm run seed. Upsert = update the row with this code, or insert it if
// missing, so running it twice still leaves three locations, not six.
async function seed(): Promise<void> {
  await connectDB();

  for (const location of LOCATIONS) {
    await LocationModel.updateOne({ code: location.code }, location, { upsert: true });
  }

  console.log(`${LOCATIONS.length} locations in ${mongoose.connection.name}`);

  // Without this the open socket keeps Node running forever.
  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
