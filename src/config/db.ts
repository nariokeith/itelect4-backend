import mongoose from "mongoose";

// The promise of a connection, kept. On Vercel this file is loaded once per
// instance but connectDB is reached from every request, so the first caller
// starts the connect and every caller after it awaits that same promise.
let connection: Promise<typeof mongoose> | null = null;

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it to your .env file.");
  }

  if (connection === null) {
    connection = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .then((m) => {
        console.log(`MongoDB connected to database "${m.connection.name}"`);
        return m;
      })
      .catch((error: unknown) => {
        // A failed attempt must not be the thing that gets kept, or every
        // later request fails with this same old error.
        connection = null;
        throw error;
      });
  }

  return connection;
}
