import express from "express";
import multer from "multer";
import { minioClient } from "../utils/minioClient.js";
import { sttQueue } from "../queues/sttQueue.js";
import { v4 as uuidv4 } from "uuid";
import File from "../models/File.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    console.log("Recieved file")
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = `${uuidv4()}-${file.originalname}`;

    // Upload to MinIO
    await minioClient.putObject(process.env.MINIO_BUCKET, fileName, file.buffer);

    // Save metadata to MongoDB
    const fileDoc = await File.create({
      originalName: file.originalname,
      fileName,
      url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${fileName}`,
      statu: "uplaoded"
    });

    console.log("file saved:", fileDoc)

    // Add job to BullMQ queue
    await sttQueue.add("transcribe", { fileId: fileDoc._id, objectName: fileName, bucket: process.env.MINIO_BUCKET, });

    res.status(200).json({ message: "File uploaded successfully", fileId: fileDoc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// GET /upload - fetch all uploaded files
router.get("/fetch", async (req, res) => {
    try {
        const files = await File.find().sort({ createdAt: -1 }); // latest first
        res.status(200).json({ files });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch files" });
    }
});

router.get("/fetch/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const file = await File.findById(id);
      if (!file) return res.status(404).json({ message: "File not found" });
      res.json({ file });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch file" });
    }
});

export default router;
