// central BullMQ setup
import registerEmailQueue, { registerEmailQueueName } from "./queues/registerQueue";
import registerEmailWorker from "./workers/registerWorker";

export {
    // Queues
    registerEmailQueue,
    registerEmailQueueName,

    // Workers
    registerEmailWorker,
};
