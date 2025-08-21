import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

export const sttQueueName = "sttQueue";

export const sttQueue = new Queue(sttQueueName, { connection });
