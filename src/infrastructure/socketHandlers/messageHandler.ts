// import { Server as SocketIOServer, Socket } from "socket.io";
// import MessageModel from "../database/dbModels/MessageModel"; 

// export const handleSocketIO = (io: SocketIOServer, socket: Socket) => {
//   socket.on("message", async (messageData) => {
//     try {
//       console.log("messageData",messageData)
//       const newMessage = new MessageModel({
//         chatId: messageData.chatId, 
//         sender: messageData.sender, 
//         content: messageData.content,
//         media: messageData.media || [], 
//         repliedTo: messageData.repliedTo ? messageData.repliedTo : null,
//       });

//       const savedMessage = await newMessage.save();

//       io.to(messageData.chatId).emit("message", savedMessage);

//       console.log(`Message saved and emitted: ${savedMessage}`);
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected", socket.id);
//   });

//   socket.on("error", (error) => {
//     console.error("Socket.IO error:", error);
//   });
// };

// import { Server as SocketIOServer, Socket } from "socket.io";
// import MessageModel from "../database/dbModels/MessageModel"; 

// export const handleSocketIO = (io: SocketIOServer, socket: Socket) => {
//   socket.on("join", (roomId: string) => {
//     console.log(`User ${socket.id} joined room ${roomId}`);
//     socket.join(roomId);
//   });

//   socket.on("leave", (roomId: string) => {
//     console.log(`User ${socket.id} left room ${roomId}`);
//     socket.leave(roomId);
//   });

//   socket.on("message", async (messageData) => {
//     try {
//       console.log("Received message data:", messageData);
//       const newMessage = new MessageModel({
//         chatId: messageData.chatId, 
//         sender: messageData.sender, 
//         content: messageData.content,
//         media: messageData.media || [], 
//         repliedTo: messageData.repliedTo ? messageData.repliedTo : null,
//       });
//       const savedMessage = await newMessage.save();
//       console.log("Message saved:", savedMessage);
      
//       // Broadcast the message to all clients in the room
//       io.in(messageData.chatId).emit("message", savedMessage);
//       console.log(`Message broadcasted to room ${messageData.chatId}`);
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected", socket.id);
//   });

//   socket.on("error", (error) => {
//     console.error("Socket.IO error:", error);
//   });
// };



import { Server as SocketIOServer, Socket } from "socket.io";
import MessageModel from "../database/dbModels/MessageModel"; 
import UserModel from "../database/dbModels/User"; 

export const handleSocketIO = (io: SocketIOServer, socket: Socket) => {
  socket.on("join", (roomId: string) => {
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("leave", (roomId: string) => {
    console.log(`User ${socket.id} left room ${roomId}`);
    socket.leave(roomId);
  });


  socket.on("message", async (messageData) => {
    try {
      console.log("Received message data:", messageData);
      
      const sender = await UserModel.findById(messageData.sender._id);
      if (!sender) {
        throw new Error("Sender not found");
      }

      const newMessage = new MessageModel({
        chatId: messageData.chatId, 
        sender: {
          _id: sender._id,
          displayName: sender.displayName, 
          profileImage: sender.profileImage
        }, 
        content: messageData.content,
        media: messageData.media || [], 
        repliedTo: messageData.repliedTo ? messageData.repliedTo : null,
      });

      const savedMessage = await newMessage.save();
      console.log("Message saved:", savedMessage);
      
      io.in(messageData.chatId).emit("message", {
        ...savedMessage.toObject(),
        sender: {
          _id: sender._id,
          displayName: sender.displayName,
          profileImage: sender.profileImage
        }
      });
      console.log(`Message broadcasted to room ${messageData.chatId}`);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
};