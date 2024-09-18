import { Server as SocketIOServer, Socket } from "socket.io";
import mongoose from "mongoose";
import MessageModel from "../database/dbModels/MessageModel";
import { getUnreadMessageCount } from "../../utils/messageUtils";
import ChatModel from "../database/dbModels/ChatModel";

export const handleSocketIO = (io: SocketIOServer, socket: Socket): void => {

  // Helper function to emit unread message count
  const emitUnreadCount = async (chatId: string, userId: string) => {
    try {
      const unreadCount = await getUnreadMessageCount(chatId, userId);
      io.to(userId).emit("unreadCountUpdate", { chatId, unreadCount });
    } catch (error) {
      console.error(`Error emitting unread count for user ${userId}:`, error);
    }
  };

  // Save new message and notify users
  // socket.on("message", async (messageData: any) => {
  //   const { chatId, sender, content, media, repliedTo, receiverId } = messageData;

  //   try {
  //     const newMessage = new MessageModel({
  //       chatId: new mongoose.Types.ObjectId(chatId),
  //       sender: new mongoose.Types.ObjectId(sender._id),
  //       content,
  //       media,
  //       repliedTo: repliedTo ? new mongoose.Types.ObjectId(repliedTo) : null,
  //     });

  //     await newMessage.save();
  //     const populatedMessage = await newMessage.populate("sender", "displayName profileImage");

  //     // Emit the new message to everyone in the chat room
  //     io.to(chatId).emit("message", populatedMessage);

  //     // Notify users in the chat with updated unread counts
  //     const chat = await ChatModel.findById(chatId);
  //     if (chat) {
  //       for (const userId of chat.users) {
  //         if (userId.toString() !== sender._id) {
  //           await emitUnreadCount(chatId, userId.toString());
  //         }
  //       }
  //     } else {
  //       console.error(`Chat with id ${chatId} not found.`);
  //     }
  //   } catch (error) {
  //     console.error("Error handling message:", error);
  //     socket.emit("error", { message: "An error occurred while handling the message." });
  //   }
  // });
// Save new message and notify users
socket.on("message", async (messageData: any) => {
  const { chatId, sender, content, media, repliedTo } = messageData;

  try {
    const newMessage = new MessageModel({
      chatId: new mongoose.Types.ObjectId(chatId),
      sender: new mongoose.Types.ObjectId(sender._id),
      content,
      media,
      repliedTo: repliedTo ? new mongoose.Types.ObjectId(repliedTo) : null,
    });

    await newMessage.save();
    const populatedMessage = await newMessage.populate("sender", "displayName profileImage");

    // Emit the new message to all users in the chat room
    io.to(chatId).emit("message", populatedMessage);

    // ** Update the chat's `updatedAt` field **
    await ChatModel.findByIdAndUpdate(chatId, { updatedAt: new Date() });

    // Notify users in the chat to update the chat list order
    const chat = await ChatModel.findById(chatId);
    if (chat) {
      for (const userId of chat.users) {
        if (userId.toString() !== sender._id) {
          const unreadCount = await getUnreadMessageCount(chatId, userId.toString());
          io.to(userId.toString()).emit("unreadCountUpdate", { chatId, unreadCount });
          // ** Emit conversation update to bring it to the top of the list **
          io.to(userId.toString()).emit("conversationUpdated", { chatId, updatedAt: new Date() });
        }
      }
    }
  } catch (error) {
    console.error("Error handling message:", error);
    socket.emit("error", { message: "An error occurred while handling the message." });
  }
});

  

  // User joins a specific chat room
  socket.on("join", (chatId: string) => {
    socket.join(chatId);
  });

  // User joins a room for receiving user-specific events (like unread counts)
  socket.on("joinUserRoom", (userId: string) => {
    socket.join(userId);
  });

  // User leaves the user-specific room
  socket.on("leaveUserRoom", (userId: string) => {
    socket.leave(userId);
  });

  // Mark messages as seen and update unread counts
  socket.on("messageSeen", async ({ chatId, userId }: { chatId: string; userId: string }) => {
    try {
      await MessageModel.updateMany(
        { chatId: new mongoose.Types.ObjectId(chatId), sender: { $ne: new mongoose.Types.ObjectId(userId) }, seen: false },
        { seen: true }
      );

      // Emit updated unread count
      await emitUnreadCount(chatId, userId);

      // Notify all users in the chat that all messages have been seen
      io.to(chatId).emit("allMessagesSeen", { chatId });
    } catch (error) {
      console.error("Error updating message seen status:", error);
    }
  });

  // Fetch unread counts for all chats the user is involved in
  socket.on("getUnreadCounts", async (userId: string) => {
    try {
      const chats = await ChatModel.find({ users: userId });
      const unreadCounts: { [chatId: string]: number } = {};

      for (const chat of chats) {
        if (chat._id) {
          const chatId = chat._id.toString();
          const unreadCount = await getUnreadMessageCount(chatId, userId);
          unreadCounts[chatId] = unreadCount;
        }
      }

      // Emit unread counts back to the user
      socket.emit("unreadCountUpdate", unreadCounts);
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  });

  // Mark messages as read and update unread counts
  socket.on("markMessagesAsRead", async ({ chatId, userId }: { chatId: string; userId: string }) => {
    try {
      await MessageModel.updateMany(
        { chatId: new mongoose.Types.ObjectId(chatId), sender: { $ne: new mongoose.Types.ObjectId(userId) }, seen: false },
        { seen: true }
      );

      // Notify all users in the chat that messages have been read
      io.to(chatId).emit("messageRead", { chatId });

      // Update the unread counts for the user
      await emitUnreadCount(chatId, userId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("messageSeen", async ({ chatId, userId }: { chatId: string; userId: string }) => {
    try {
      await MessageModel.updateMany(
        { chatId: new mongoose.Types.ObjectId(chatId), sender: { $ne: new mongoose.Types.ObjectId(userId) }, seen: false },
        { seen: true }
      );
  
      // Emit updated unread count and notify sender of the read status
      io.to(chatId).emit("messageRead", { chatId });
  
      // Update the unread counts for the user
      await emitUnreadCount(chatId, userId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });
  
};
