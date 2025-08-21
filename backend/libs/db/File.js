// libs/db/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['uploaded', 'processing', 'transcribed', 'scoring', 'completed', 'failed'], 
    default: 'uploaded' 
  },
  transcript: { type: String, default: null },
  scores: { type: Object, default: null },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
