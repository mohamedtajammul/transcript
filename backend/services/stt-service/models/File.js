import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "uploaded", "processing", "transcribed", "rated", "failed"], 
    default: "pending" 
  }, 
  transcript: { type: String }, // added for STT results
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update `updatedAt` on every save
fileSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const File = mongoose.model("File", fileSchema);

export default File;
