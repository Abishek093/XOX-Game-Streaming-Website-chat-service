import { IChatModel } from "../../infrastructure/database/dbModels/ChatModel";
import { IMessage } from "../../infrastructure/database/dbModels/MessageModel";

export interface ChatRepositories {
  checkChat(initiatorId: string, recipientId: string): Promise<IChatModel | null>;
  newChat(initiatorId: string, recipientId: string): Promise<IChatModel | null>
  fetchConversations(userId: string): Promise<IChatModel[]>
  fetchMessages(chatId: string):Promise<IMessage[]>
  fetchLastMessage(chatId: string): Promise<IMessage | null>
  deleteMessage(id : string):Promise<void>
}
