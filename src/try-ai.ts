// ===== GT5: a NEW file ================================================
// ===== no GT4 version -- nothing to compare it to =====================
import "dotenv/config";
import { draftReport } from "./ai/gemini.js";

// npm run try-ai. One real request to Gemini from your terminal -- the
// same function POST /api/ai calls, with no Express, no token and no
// database. If this prints a draft, the key, the model name and the
// schema all work.
async function tryAi(): Promise<void> {
  const draft = await draftReport(
    "found a blue umbrella w/ white polka dots in the library 2nd floor " +
      "near the computers this morning, it has a small tear on one side",
  );
  console.log(JSON.stringify(draft, null, 2));
}

tryAi().catch((err: unknown) => {
  console.error("Gemini call failed:", err);
  process.exit(1);
});
