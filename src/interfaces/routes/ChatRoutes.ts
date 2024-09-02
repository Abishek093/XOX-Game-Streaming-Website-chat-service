import { Router } from "express";

const chatRouter = Router()

chatRouter.get(`/check-chat/follower/:followerId/user/:userId`)


export default chatRouter