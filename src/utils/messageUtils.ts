import mongoose from "mongoose";
import MessageModel from "../infrastructure/database/dbModels/MessageModel"; // Import the message model

/**
 * This function calculates the number of unread messages in a specific chat for a given user.
 * 
 * @param chatId - The ID of the chat
 * @param userId - The ID of the user for whom unread messages are being calculated (the receiver)
 * @returns - The count of unread messages for the specified user
 */
export const getUnreadMessageCount = async (chatId: string, userId: string): Promise<number> => {
  try {
    const unreadCount = await MessageModel.countDocuments({
      chatId: new mongoose.Types.ObjectId(chatId),
      sender: { $ne: userId },  // Exclude messages sent by the user themselves
      seen: false,  // Only count messages that haven't been marked as "seen"
    });

    return unreadCount;
  } catch (error) {
    console.error("Error getting unread message count:", error);
    return 0;  // Return 0 in case of an error
  }
};
