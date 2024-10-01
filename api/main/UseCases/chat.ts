import prisma from "../../prisma/prisma";
import IChatObject from "../interfaces/IChatObject";
import { v4 as uuidv4 } from "uuid";

export default class ChatCases {
    static async createChat(data: IChatObject, userId: string) {

        const hasChat = await prisma.chat.findFirst({ where: { hostId: userId } });
        if (hasChat) {
            const usersInChat = await prisma.chatUser.count({ where: { chatId: hasChat.id } });

            if (usersInChat > 1) {
                const nextHost = await prisma.chatUser.findFirst({
                    where: {
                        chatId: hasChat.id, userId: { not: userId }
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
                name: data.name,
                description: data.description,
                capacity: Number(data.capacity),
                status: "open",
                hostId: userId,
                language: data.language
            }
        });

        return chat.id;
    }

    static async joinChat(chatId: string, userId: string) {
        const isAlreadyInChat = await prisma.chatUser.findFirst({
            where: { userId: userId }
        });

        if (isAlreadyInChat && isAlreadyInChat.chatId === chatId) return;
        if (isAlreadyInChat && isAlreadyInChat.chatId !== chatId) {
            await prisma.chatUser.delete({ where: { userId: userId } });
            const hasChat = await prisma.chat.findFirst({ where: { hostId: userId } });

            if (hasChat) {
                const usersInChat = await prisma.chatUser.count({ where: { chatId: hasChat.id } });

                if (usersInChat > 1) {
                    const nextHost = await prisma.chatUser.findFirst({
                        where: {
                            chatId: hasChat.id, userId: { not: userId }
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
        }


        await prisma.chatUser.create({
            data: {
                chatId: chatId,
                userId: userId
            }
        });
    }

    static async getUsersInChat(chatId: string) {
        const users = await prisma.chatUser.findMany({
            where: { chatId: chatId },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return users.map(chatUser => chatUser.user);
    }

    static async writeMessage(chatId: string, userId: string, text: string) {
        const message = await prisma.message.create({
            data: {
                chatId: chatId,
                userId: userId,
                text: text,
                date: new Date()
            },
            select: {
                text: true,
                date: true,
                user: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        })
        return {
            text: message.text,
            date: message.date,
            name: message.user.name,
            userid: message.user.id
        };
    }

    static async getMessages(chatId: string) {
        const messages = await prisma.message.findMany({
            where: { chatId: chatId },
            select: {
                text: true,
                date: true,
                user: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });
        const data = messages.map(message => {
            return {
                text: message.text,
                date: message.date,
                name: message.user.name,
                userid: message.user.id
            }
        })

        return data;
    }   

}