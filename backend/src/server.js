import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

dotenv.config();

const port = process.env.PORT || 5000;

console.log(`Starting with MONGODB_URI: ${(process.env.MONGODB_URI || "").slice(0, 50)}...`);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

connectDB()
  .then(() => {
    const app = createApp();
    const server = app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Is another instance running?`);
        process.exit(1);
      }
      console.error("Server error:", err.message);
    });
  })
  .catch((error) => {
    console.error("===========================================");
    console.error("FAILED TO START SERVER");
    console.error("===========================================");
    console.error("Error:", error.message);
    if (error.name === "MongooseServerSelectionError") {
      console.error("CAUSE: MongoDB connection failed. Check:");
      console.error("  1. MONGODB_URI in backend/.env is correct");
      console.error("  2. Network access is configured in MongoDB Atlas");
      console.error("  3. Database user credentials are valid");
    }
    console.error("===========================================");
    process.exit(1);
  });
