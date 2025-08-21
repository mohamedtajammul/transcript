import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { startRatingWorker } from "./workers/ratingWorker.js";

dotenv.config();

const app = express();
app.use(express.json());

// 1️⃣ Connect to MongoDB
connectDB();

// 2️⃣ Start the rating worker
startRatingWorker();

// 4️⃣ Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Rating service running on port ${PORT}`));
