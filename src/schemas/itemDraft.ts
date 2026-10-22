// ===== GT5: a NEW file ================================================
// ===== no GT4 version -- nothing to compare it to =====================
import { z } from "zod";

// What a client is allowed to send to POST /api/ai. Checked before
// anything is sent to Gemini, because every request that reaches Gemini
// is counted against the free quota -- a request that was never going to
// work should cost nothing.
export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe the item in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

// What Gemini has to send BACK: a clean draft of a lost-and-found report.
// This one schema is used three ways:
//   1. z.infer below turns it into the ItemDraft type for TypeScript.
//   2. z.toJSONSchema at the bottom turns it into the JSON Schema that is
//      sent to Gemini with every request.
//   3. itemDraftSchema.safeParse in src/ai/gemini.ts checks the reply.
// .describe() is not a comment: the text travels to Gemini inside the
// JSON Schema and tells the model what each field is for.
export const itemDraftSchema = z.object({
  title: z
    .string()
    .max(60)
    .describe("A short listing title for the item, at most 60 characters."),
  summary: z
    .string()
    .describe("One clean sentence describing the item, where and when."),
  category: z
    .enum(["electronics", "wallet-or-id", "bag", "accessory", "clothing", "other"])
    .describe("The kind of item."),
  clarity: z
    .enum(["clear", "needs-details", "too-vague"])
    .describe("How easy the item would be to recognise from the description."),
  tips: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("One to three concrete next steps for the student."),
});

export type ItemDraft = z.infer<typeof itemDraftSchema>;

// Computed once, when this file is first imported -- not per request.
export const itemDraftJsonSchema = z.toJSONSchema(itemDraftSchema);
