import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const app = createApp();
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
