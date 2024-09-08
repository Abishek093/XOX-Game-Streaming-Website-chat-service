import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { handleSocketIO } from "./socketHandlers/messageHandler";

export const createSocketIOServer = (server: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ["GET", "POST"]
    } 
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    handleSocketIO(io, socket)
    

    // socket.on("message", (message) => {
    //   console.log(`Received message => ${message}`);
    //   io.emit("message", message);          
    // });


    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });

    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });
  });

  return io;
};
