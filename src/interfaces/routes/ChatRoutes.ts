import { Router } from "express";
import { checkChat, fetchConversations, fetchMessages, newChat, uploadMedia } from "../controllers/ChatController";
import { protectUser } from "../../infrastructure/middlewares/authMiddleware";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const chatRouter = Router();

chatRouter.get(`/check-chat/initiator/:initiatorId/recipient/:recipientId`, protectUser, checkChat);
chatRouter.post(`/new-chat/initiator/:initiatorId/recipient/:recipientId`, protectUser, newChat);
chatRouter.get(`/fetch-conversations/:userId`, protectUser, fetchConversations)
chatRouter.get(`/fetch-messages/:chatId`, protectUser, fetchMessages);
chatRouter.post('/upload-media', protectUser, upload.single('file'), uploadMedia);



export default chatRouter;
