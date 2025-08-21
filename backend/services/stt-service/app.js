import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import transcriptRouter from "./routes/transcript.js";
import { startSTTWorker } from "./workers/sttWorker.js"; // renamed function

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/transcript", transcriptRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "stt-service" });
});

const PORT = process.env.PORT || 4002;

const start = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    // Start BullMQ worker
    await startSTTWorker(); // modularized

    app.listen(PORT, () => {
      console.log(`🚀 stt-service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start stt-service:", err);
    process.exit(1);
  }
};

start();
