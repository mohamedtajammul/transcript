import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import uploadRouter from "./routes/upload.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());

// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }));

app.use(express.json());

connectDB();

app.use("/upload", uploadRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`UploadService running on port ${PORT}`));
