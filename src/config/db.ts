import mongoose from "mongoose";

// ===== SESSION 9: connect every time it is called =====
// export async function connectDB(): Promise<void> {
//   ...
//   await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
// }
// NOTE: On Vercel connectDB is reached from every request, so that would
//       connect once per request instead of once per instance.
// ===== SESSION 10: keep the PROMISE, so every caller shares one connect =====

let connection: Promise<typeof mongoose> | null = null;

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env and fill it in.");
  }

  if (connection === null) {
    connection = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .then((m) => {
        console.log("MongoDB connected:", m.connection.name);
        return m;
      })
      .catch((err: unknown) => {
        // Never keep a failed attempt, or every later request fails too.
        connection = null;
        throw err;
      });
  }

  return connection;
}
