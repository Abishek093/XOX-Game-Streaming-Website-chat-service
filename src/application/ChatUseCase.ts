import { MongoChatRepository } from "../infrastructure/Repositories/MongoChatRepository";

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

