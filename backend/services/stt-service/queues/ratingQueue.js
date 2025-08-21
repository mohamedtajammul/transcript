import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

export const ratingQueueName = "rating-queue";

// Queue instance for pushing jobs
export const ratingQueue = new Queue(ratingQueueName, { connection });
