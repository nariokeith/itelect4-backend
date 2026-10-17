import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./config/db";

// Local development only. On Vercel the default export in app.ts is the entry
// point and this file never runs.
const PORT = Number(process.env.PORT) || 4000;

// Started immediately so a wrong MONGODB_URI shows up here within five
// seconds. Logged, not exited: the middleware in app.ts waits for this same
// connection, and a failed request reports what happened.
connectDB().catch((error: unknown) => {
  console.error("Could not connect to MongoDB:", error instanceof Error ? error.message : error);
});

app.listen(PORT, (error?: Error) => {
  if (error) {
    console.error(`Could not listen on port ${PORT}: ${error.message}`);
    process.exit(1);
  }
  console.log(`API listening on http://localhost:${PORT}`);
});
