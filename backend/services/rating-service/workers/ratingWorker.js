import { Worker } from "bullmq";
import IORedis from "ioredis";
import File from "../models/File.js";
import openai from "../config/openai.js"; // your existing OpenAI config

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

export const startRatingWorker = () => {
  const worker = new Worker(
    "rating-queue",
    async (job) => {
      const { fileId, transcript } = job.data;

      try {
        // Call OpenAI to get ratings
        const prompt = `
            You are an expert quality analyst for a BPO (Call Center) evaluating customer support calls.

            Rate the following transcript of a customer executive call on a scale of 1-10 for each of these criteria:

            1. Opening - How professional and engaging the agent's greeting was.
            2. Issue Understanding - How well the agent understood and acknowledged the customer's problem.
            3. Tone / Sentiment - How polite, empathetic, and appropriate the agent's tone was.
            4. CSAT (Customer Satisfaction) - Likelihood that the customer would be satisfied with this interaction.

            Transcript:
            ${transcript}

            Return JSON only in this exact format:
            {
            "opening": 8,
            "issueUnderstanding": 7,
            "tone": 9,
            "csat": 8
            }
        `;

        const response = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
        });

        const ratingText = response.choices[0].message.content;

        // Parse JSON response
        let score;
        try {
          score = JSON.parse(ratingText);
        } catch (err) {
          console.error("❌ Failed to parse rating JSON, falling back to random scores", err);
          // fallback random scores
          score = {
            opening: 0,
            issueUnderstanding: 0,
            tone: 0,
            csat: 0,
          };
        }

        // Update the File document with rating and status
        const updatedFile = await File.findByIdAndUpdate(
          fileId,
          { rating: score, status: "rated" },
          { new: true }
        );

        console.log(`✅ Transcript rated for fileId: ${fileId}`, score);
        return updatedFile;

      } catch (err) {
        console.error(`❌ Rating failed for fileId: ${fileId}`, err);
        throw err; // mark job as failed in BullMQ
      }
    },
    { connection }
  );

  worker.on("completed", (job) =>
    console.log(`🎉 Rating job ${job.id} completed`)
  );
  worker.on("failed", (job, err) =>
    console.error(`⚠️ Rating job ${job.id} failed:`, err.message)
  );

  console.log("🚀 Rating worker started");
};
