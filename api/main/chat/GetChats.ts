import { Request, Response } from 'express';
import ChatCases from '../UseCases/chat';

export class GetChats {
    static async execute(
        req: Request,
        res: Response
    ) {
        const userid = req.params.id

        const chatCases = new ChatCases(userid)

        const chats = await chatCases.getChats()
        const userActiveChat = await chatCases.getUserActiveChat()

        res.status(200).json({
            chats: chats,
            userActiveChat: userActiveChat
        })
    }
}