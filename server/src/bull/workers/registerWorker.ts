import { Worker } from "bullmq";
import { redisConnection } from "../bullConfig";
import { registerEmailQueueName } from "../queues/registerQueue";
import { processRegisterEmailJob } from "../processors/registerProcessor";
import _config from "@/config";

const registerEmailWorker = new Worker(registerEmailQueueName, processRegisterEmailJob, {
    connection: redisConnection,
    removeOnComplete: { count: 0 },
    concurrency: Number(_config.ENV.BULLMQ_WORKER_CONCURRENCY)
});

registerEmailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

registerEmailWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed: ${err.message}`);
});

export default registerEmailWorker;