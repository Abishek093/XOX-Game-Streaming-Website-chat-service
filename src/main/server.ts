// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import http from "http";
// import WebSocket from "ws";

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws: WebSocket) => {
//   ws.on("message", (message: string) => {
//     console.log(`Received message => ${message}`);
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });

//   ws.send("Welcome to the chat service!");
// });

// app.get("/", (req, res) => {
//   res.send("Chat service is running");
// });

// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => {
//   console.log(`Chat service listening on port ${PORT}`);
// });



import dotenv from "dotenv";
dotenv.config();

import { createHttpServer } from "../infrastructure/HttpServer";
import { createWebSocketServer } from "../infrastructure/WebSocketServer";
  import connectDB from "../infrastructure/config/db";
import { startQueueConsumer } from "../services/queueService";

const server = createHttpServer();
const wss = createWebSocketServer(server);

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    startQueueConsumer()
    server.listen(PORT, () => {
      console.log(`Chat service listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });