import { Worker } from "bullmq";
import IORedis from "ioredis";
import { File } from "node:buffer"; 

import FileModel from "../models/File.js";
import { sttQueueName } from "../queues/sttQueue.js";
import { ratingQueue } from "../queues/ratingQueue.js";
import { minioClient } from "../utils/minioClient.js";
import openai from "../config/openai.js";

export const startSTTWorker = async () => {
  // Create Redis connection
  const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });

  // Wait for Redis to be ready
  let retries = 5;
  while (retries > 0) {
    try {
      await connection.ping();
      console.log("✅ Redis connected");
      break;
    } catch (err) {
      retries--;
      console.log("⏳ Waiting for Redis... retries left:", retries);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Create worker with explicit Redis connection
  const worker = new Worker(
    sttQueueName,
    async (job) => {
      const { fileId, bucket, objectName } = job.data;

      // Update status to processing
      await FileModel.findByIdAndUpdate(fileId, { status: "processing" });

      try {
        // Download object from MinIO
        const stream = await minioClient.getObject(bucket, objectName);
        console.log("🎧 Retrieved audio from queue:", bucket, objectName);

        // Read stream into buffer
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Wrap buffer in File 
        const audioFile = new File([buffer], objectName, { type: "audio/mpeg" }); // adjust MIME if needed

        // Call OpenAI Whisper API
        const transcriptRes = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1",
        });

        console.log("📝 Transcription result:", transcriptRes.text);

        // Update DB with transcript
        await FileModel.findByIdAndUpdate(fileId, {
          status: "transcribed",
          transcript: transcriptRes.text,
        });

        console.log(`✅ Transcription done for ${fileId}`);

        // Push to rating-queue
        await ratingQueue.add("rateTranscript", {
            fileId,
            transcript: transcriptRes.text,
            bucket,
            objectName,
        });
        
        console.log(`➡️ Pushed transcript to rating-queue for ${fileId}`);
      } catch (err) {
        console.error(`❌ STT failed for ${fileId}`, err);
        await FileModel.findByIdAndUpdate(fileId, { status: "failed" });
        throw err; // rethrow so BullMQ knows job failed
      }
    },
    { connection }
  );

  worker.on("completed", (job) =>
    console.log(`🎉 STT job ${job.id} completed`)
  );
  worker.on("failed", (job, err) =>
    console.error(`⚠️ STT job ${job?.id} failed:`, err.message)
  );

  return worker;
};
