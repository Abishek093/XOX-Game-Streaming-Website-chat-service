// import dotenv from "dotenv";
// dotenv.config();

// import { createHttpServer } from "../infrastructure/HttpServer";
// import { createWebSocketServer } from "../infrastructure/WebSocketServer";
// import connectDB from "../infrastructure/config/db";
// import { startQueueConsumer } from "../services/queueService";

// const server = createHttpServer();

// const PORT = process.env.PORT || 5001;

// connectDB()
//   .then(() => {
//     startQueueConsumer()
//     server.listen(PORT, () => {
//       console.log(`Chat service listening on port ${PORT}`);
//     });
//   })
//   .catch(error => {
//     console.error("Failed to connect to the database:", error);
//     process.exit(1);
//   });


import dotenv from "dotenv";
dotenv.config();

import { createHttpServer } from "../infrastructure/HttpServer";
import { createSocketIOServer } from "../infrastructure/SocketIOServer"; 
import connectDB from "../infrastructure/config/db";
import { startQueueConsumer } from "../services/queueService";

const server = createHttpServer();
const io = createSocketIOServer(server);     

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => { 
    startQueueConsumer();
    server.listen(PORT, () => {
      console.log(`Chat service listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
