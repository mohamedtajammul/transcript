import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending, processing, done
  createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

export default File;
