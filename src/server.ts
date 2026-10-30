import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 4000;

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
