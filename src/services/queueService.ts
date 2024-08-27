import { consumeQueue } from "../infrastructure/RabbitMQConsumer";
import { handleUserMessage } from "../application/HandleUserMessage";

export const startQueueConsumer = () => {
  consumeQueue('chat-service-user-data', handleUserMessage);
};
