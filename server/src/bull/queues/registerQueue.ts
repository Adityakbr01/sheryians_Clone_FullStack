import { Queue } from "bullmq";
import { redisConnection } from "../bullConfig";

export const registerEmailQueueName = "registerEmailQueue";

const registerEmailQueue = new Queue(registerEmailQueueName, {
    connection: redisConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true
    }
});

export default registerEmailQueue;
