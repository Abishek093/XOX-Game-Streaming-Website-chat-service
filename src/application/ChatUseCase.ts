import ChatModel from "../infrastructure/database/dbModels/ChatModel";
import { MongoChatRepository } from "../infrastructure/Repositories/MongoChatRepository";
import { getUnreadMessageCount } from "../utils/messageUtils";

const chatRepositories = new MongoChatRepository();

export const CheckChatUseCase = async (initiatorId: string, recipientId: string) => {
    const chat = await chatRepositories.checkChat(initiatorId, recipientId);
    return chat;
};

export const NewChatUseCase = async(initiatorId: string, recipientId: string)=>{
  console.log("2",initiatorId, recipientId)
  const newChat = await chatRepositories.newChat(initiatorId, recipientId)
  return newChat
}

export const FetchConversationsUseCase= async(userId: string)=>{
  const conversations = await chatRepositories.fetchConversations(userId)
  return conversations
}

export const FetchMessagesUseCase = async(chatId: string)=>{
  const messages = await chatRepositories.fetchMessages(chatId)
  return messages
}

export const FetchLastMessageUseCase = async (chatId: string) => {
  const lastMessage = await chatRepositories.fetchLastMessage(chatId);
  return lastMessage;
};

export const DeleteMessageUseCase = async(id : string)=>{
  const msg = await chatRepositories.deleteMessage(id)
}

export const fetchUnreadCountsUseCase = async (userId: string) => {
  try {
    // Fetch all chats that the user is part of
    const chats = await ChatModel.find({ users: userId });

    // Initialize an object to store unread counts
    const unreadCounts: { [key: string]: number } = {};

    // Loop through each chat and fetch the unread message count
    for (const chat of chats) {
      const unreadCount = await getUnreadMessageCount(chat.id.toString(), userId);
      unreadCounts[chat.id.toString()] = unreadCount;
    }

    return unreadCounts;
  } catch (error) {
    console.error("Error in fetchUnreadCountsUseCase:", error);
    throw new Error("Failed to fetch unread counts");
  }
};