import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import IChatObject from "../interfaces/IChatObject";
import "dotenv/config";
import chatSchema from "../schemas/Chat";
import { BadRequest } from "../CustomErrors/exceptions";

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

        const hasChat = await prisma.chat.findFirst({ where: { hostId: user.id } });
        if (hasChat) {
            const usersInChat =  await prisma.chatUser.count({ where: { chatId: hasChat.id } });

            if (usersInChat > 1) {
                const nextHost = await prisma.chatUser.findFirst({ 
                    where: { 
                        chatId: hasChat.id, userId: { not: user.id } 
                    } 
                });

                await prisma.chat.update({
                    where: { id: hasChat.id },
                    data: { hostId: nextHost!.userId }
                });
            }

            else {
                await prisma.chat.delete({ where: { id: hasChat.id } });
            }
        }

        const chat = await prisma.chat.create({
            data: {
                id: uuidv4(),
                name: name,
                description: description,
                capacity: Number(capacity),
                status: "open",
                hostId: user.id,
                language: language,
            }
        });

        return res.status(201).json(chat);
    }
}