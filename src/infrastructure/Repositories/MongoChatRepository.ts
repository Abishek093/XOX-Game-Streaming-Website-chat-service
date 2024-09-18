// import { ChatRepositories } from "../../domain/Repositories/ChatRepositories";
// import ChatModel, { IChatModel } from "../database/dbModels/ChatModel";
// import MessageModel, { IMessage } from "../database/dbModels/MessageModel";
// import { ObjectId } from 'mongodb';

// export class MongoChatRepository implements ChatRepositories {
// //   async checkChat(initiatorId: string, recipientId: string): Promise<IChatModel | null> {
// //     const chat = await ChatModel.findOne({
// //       users: { $all: [initiatorId, recipientId] },
// //     });
// //     return chat;
// // }

// //   async newChat(initiatorId: string, recipientId: string): Promise<IChatModel | null> {
// //     try {
// //       // const existingChat = await ChatModel.findOne({users : {$all : [initiatorId, recipientId]}})
// //       console.log("3", initiatorId, recipientId)
// //       const newChat = new ChatModel({
// //         users: [initiatorId, recipientId],
// //         initiator: initiatorId,
// //         is_blocked: false,
// //         is_accepted: 'pending'
// //       })
// //       await newChat.save()
// //       console.log("4", newChat)
// //       console.log("newChat", newChat)
// //       return newChat
// //     } catch (error) {
// //       console.log(error)
// //       return null
// //     }
// //   }

// async checkChat(initiatorId: string, recipientId: string): Promise<IChatModel | null> {
//   return await ChatModel.findOne({
//     users: { $all: [new ObjectId(initiatorId), new ObjectId(recipientId)] },
//   });
// }

// async newChat(initiatorId: string, recipientId: string): Promise<IChatModel | null> {
//   try {
//     // Check if a chat already exists
//     const existingChat = await this.checkChat(initiatorId, recipientId);
//     if (existingChat) {
//       console.log("Chat already exist", existingChat)
//       return existingChat; // Return the existing chat if found
//     }

//     // Create a new chat if no existing chat is found
//     const newChat = new ChatModel({
//       users: [new ObjectId(initiatorId), new ObjectId(recipientId)],
//       initiator: new ObjectId(initiatorId),
//       is_blocked: false,
//       is_accepted: 'pending',
//     });
//     await newChat.save();
//     return newChat;
//   } catch (error: any) {
//     if (error.code === 11000) {
//       // Duplicate key error - find the existing chat and return it
//       const existingChat = await this.checkChat(initiatorId, recipientId);
//       return existingChat;
//     }
//     console.log("Error creating new chat:", error);
//     return null;
//   }
// }

//   async fetchConversations(userId: string): Promise<IChatModel[]> {
//     try {
//       const conversations = await ChatModel.find({
//         users: userId,
//         is_accepted: { $in: ['pending', 'accepted'] },
//       })
//         .populate({
//           path: 'users',
//           match: { _id: { $ne: userId } },
//           select: 'username displayName profileImage',
//         });

//       return conversations;
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//       throw error;
//     }
//   }

//   async fetchMessages(chatId: string): Promise<IMessage[]> {
//     try {
//       const messages = await MessageModel.find({ chatId }).populate('sender', 'displayName profileImage');
//       return messages
//     } catch (error) {
//       throw new Error("Failed to fetch the messages")
//     }
//   }

// }



import { ChatRepositories } from "../../domain/Repositories/ChatRepositories";
import ChatModel, { IChatModel } from "../database/dbModels/ChatModel";
import { ObjectId } from 'mongodb';
import MessageModel, { IMessage } from "../database/dbModels/MessageModel";

export class MongoChatRepository implements ChatRepositories {

  async checkChat(initiatorId: string, recipientId: string): Promise<IChatModel | null> {
    return await ChatModel.findOne({
      users: { $all: [new ObjectId(initiatorId), new ObjectId(recipientId)] },
    });
  }

  async newChat(initiatorId: string, recipientId: string): Promise<IChatModel | null> {
    try {
      // Check if a chat already exists
      const existingChat = await this.checkChat(initiatorId, recipientId);
      if (existingChat) {
        console.log("Chat already exists", existingChat);
        return existingChat; // Return the existing chat if found
      }

      // Create a new chat if no existing chat is found
      const newChat = new ChatModel({
        users: [new ObjectId(initiatorId), new ObjectId(recipientId)],
        initiator: new ObjectId(initiatorId),
        is_blocked: false,
        is_accepted: 'pending'
      });
      await newChat.save();
      return newChat;
    } catch (error) {
      console.error("Error creating chat", error);
      return null;
    }
  }

  async fetchConversations(userId: string): Promise<IChatModel[]> {
    try {
      const conversations = await ChatModel.find({
        users: userId,
        is_accepted: { $in: ['pending', 'accepted'] },
      })
        .populate({
          path: 'users',
          match: { _id: { $ne: userId } },
          select: 'username displayName profileImage',
        });

      return conversations;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  }

  async fetchMessages(chatId: string): Promise<IMessage[]> {
    try {
      const messages = await MessageModel.find({ chatId }).populate('sender', 'displayName profileImage');
      return messages
    } catch (error) {
      throw new Error("Failed to fetch the messages")
    }
  }

  async fetchLastMessage(chatId: string): Promise<IMessage | null> {
    try {
      const lastMessage = await MessageModel.findOne({ chatId })
        .sort({ createdAt: -1 })
        .populate('sender', 'displayName profileImage');
      return lastMessage;
    } catch (error) {
      console.error("Error fetching last message:", error);
      throw new Error("Failed to fetch the last message");
    }
  }
  
  async deleteMessage(id : string):Promise<void>{
    const message = await MessageModel.findByIdAndDelete(id)
  }
}

