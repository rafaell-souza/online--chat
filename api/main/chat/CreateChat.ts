import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import IChatObject from "../interfaces/IChatObject";
import "dotenv/config";
import chatSchema from "../schemas/Chat";
import { BadRequest } from "../CustomErrors/exceptions";
import ChatCases from "../UseCases/chat";

export default class CreateChat {
    static async execute (
        req: Request,
        res: Response
    ) {
        const { name, description, capacity, language }: IChatObject = req.body;

        const token = req.headers!.authorization!.split(" ")[1];
        const user = jwt.decode(token) as { id: string };

        const chatData = { name, description, capacity, language };

        const { error } = chatSchema.safeParse(chatData);
        if (error) throw new BadRequest(error.errors[0].message);

        const chatCases = new ChatCases(user.id);

        const userChat = await chatCases.findUserChat();
        
        if (userChat) {
            await chatCases.removeUserFromChat(userChat);

            const countUsersInChat = await chatCases.countUsersInChat(userChat);

            if (countUsersInChat === 0) {
                await chatCases.deleteUserChat();
            } else {
                await chatCases.setNewHost(userChat);
            }
        }

        const newChatId = await chatCases.createChat(chatData);
        const newToken = jwt.sign({ id: user.id, hostFor: newChatId }, process.env.JWT_SECRET!);

        return res.status(201).json({
            chatid: newChatId,
            newToken: newToken
        });
    }   
}