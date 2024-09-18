import { Response, Request } from "express";
import { CheckChatUseCase, DeleteMessageUseCase, FetchConversationsUseCase, FetchLastMessageUseCase, FetchMessagesUseCase, fetchUnreadCountsUseCase, NewChatUseCase } from "../../application/ChatUseCase";
import { handleResponse } from "./responseHandler";
import { uploadToS3 } from "../../utils/s3Uploader";

export const checkChat = async (req: Request, res: Response) => {
  try {
    const { initiatorId, recipientId } = req.params;
    const chat = await CheckChatUseCase(initiatorId, recipientId);
    if (chat) {
      console.log(chat)
      handleResponse(res, 200, chat)
    } else {
      console.log('Chat not found')
      handleResponse(res, 204, "Chat not found")
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const newChat = async(req: Request, res: Response)=>{
  const { initiatorId, recipientId } = req.params;
  console.log("1",initiatorId, recipientId)
  try {
    const newChat = await NewChatUseCase(initiatorId, recipientId)
    handleResponse(res, 200, newChat)
  } catch (error) {
    handleResponse(res, 500, "Internal server error")
  }
}

export const fetchConversations = async(req: Request, res: Response)=>{
  const {userId} = req.params
  try {
    const conversations = await FetchConversationsUseCase(userId)
    handleResponse(res, 200, conversations)
  } catch (error: any) {
    handleResponse(res, 500, "Internal server error")
  }
}

export const fetchMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await FetchMessagesUseCase(chatId)
    handleResponse(res, 200, messages)
  } catch (error) {
    handleResponse(res, 500, "Internal server error");
  }
};


export const uploadMedia = async (req: Request, res: Response) => {
  console.log("uploadMedia")
  try {
    if (!req.file) {
      return handleResponse(res, 400, "No file uploaded");
    }
    console.log("req.file",req.file)
    const fileUrl = await uploadToS3(req.file);
    console.log("fileUrl",fileUrl)
    handleResponse(res, 200, { url: fileUrl });
  } catch (error) {
    console.error("Error uploading media:", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const fetchLastMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const lastMessage = await FetchLastMessageUseCase(chatId);
    handleResponse(res, 200, lastMessage);
  } catch (error) {
    handleResponse(res, 500, "Internal server error");
  }
};

export const deleteMessage = async(req: Request, res: Response)=>{
  const {id} = req.params
  console.log("message id", id)
  const msg = await DeleteMessageUseCase(id)
  handleResponse(res, 200, "deleted succesfully")
}


export const fetchUnreadCountsController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const unreadCounts = await fetchUnreadCountsUseCase(userId);
    
    if (unreadCounts) {
      return handleResponse(res, 200, unreadCounts);
    } else {
      return handleResponse(res, 404, "No unread messages found");
    }
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    return handleResponse(res, 500, "Failed to fetch unread counts");
  }
};