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

export const ratingQueue = new Queue(ratingQueueName, { connection });
