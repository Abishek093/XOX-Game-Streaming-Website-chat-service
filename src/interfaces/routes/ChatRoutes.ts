import { Router } from "express";
import { checkChat, deleteMessage, fetchConversations, fetchLastMessage, fetchMessages, fetchUnreadCountsController, newChat, uploadMedia } from "../controllers/ChatController";
import { protectUser } from "../../infrastructure/middlewares/authMiddleware";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const chatRouter = Router();

chatRouter.get(`/check-chat/initiator/:initiatorId/recipient/:recipientId`, protectUser, checkChat);
chatRouter.post(`/new-chat/initiator/:initiatorId/recipient/:recipientId`, protectUser, newChat);
chatRouter.get(`/fetch-conversations/:userId`, protectUser, fetchConversations)
chatRouter.get(`/fetch-messages/:chatId`, protectUser, fetchMessages);
chatRouter.post('/upload-media', protectUser, upload.single('file'), uploadMedia);
chatRouter.get(`/fetch-last-message/:chatId`, protectUser, fetchLastMessage);
chatRouter.post('/delete-message/:id',protectUser, deleteMessage)
chatRouter.get('/fetch-unread-counts/:userId', protectUser, fetchUnreadCountsController);



export default chatRouter;
