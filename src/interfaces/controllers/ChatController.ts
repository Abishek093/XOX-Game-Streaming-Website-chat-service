import { Response, Request } from "express";

export const checkChat = async(req: Request, res: Response){
    const { followerId, userId } = req.params;
    
}