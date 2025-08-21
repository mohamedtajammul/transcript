import express from "express";
import File from "../models/File.js";

const router = express.Router();

/**
 * GET /transcript/:id
 * Fetch the transcript for a given file
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const fileDoc = await File.findById(id);

    if (!fileDoc) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({
      fileId: fileDoc._id,
      originalName: fileDoc.originalName,
      status: fileDoc.status,
      transcript: fileDoc.transcript || null,
    });
  } catch (err) {
    console.error("Error fetching transcript:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
