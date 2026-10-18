import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = Number(process.env.PORT) || 4000;

// ===== SESSION 9: connect first, then listen; exit on failure =====
// NOTE: app.ts now waits for the database itself (middleware), so listening
//       no longer has to wait. Logged, not exited.
// ===== SESSION 10 =====
connectDB().catch((err: unknown) => {
  console.error("Could not connect to MongoDB:", err);
});

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
