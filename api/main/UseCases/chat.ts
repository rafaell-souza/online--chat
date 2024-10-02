import prisma from "../../prisma/prisma";
import IChatObject from "../interfaces/IChatObject";
import { v4 as uuidv4 } from "uuid";

export default class ChatCases {
    userid: string;

    constructor(userid: string) {
        this.userid = userid;
    }

    async findUserChat() {
        const chat = await prisma.chat.findUnique({
            where: { hostId: this.userid }
        })

        return chat?.id
    }

    async deleteUserChat() {
        await prisma.chat.delete({
            where: { hostId: this.userid },
        })
    }

    async countUsersInChat(chatid: string) {
        return await prisma.chatUser.count({
            where: { chatId: chatid }
        })
    }

    async setNewHost(chatid: string) {
        const nextHost = await prisma.chatUser.findFirst({
            where: {
                chatId: chatid,
                userId: { not: this.userid }
            }
        });

        await prisma.chat.update({
            where: { id: chatid },
            data: { hostId: nextHost!.userId }
        })
    }

    async removeUserFromChat(chatid: string) {
        const a = await prisma.chatUser.delete({
            where: {
                userId: this.userid,
                chatId: chatid
            }
        })  
    }

    async createChat(chatData: IChatObject) {

        const chat = await prisma.chat.create({
            data: {
                id: uuidv4(),
                name: chatData.name,
                description: chatData.description,
                capacity: Number(chatData.capacity),
                status: "open",
                hostId: this.userid,
                language: chatData.language
            }
        })

        return chat.id;
    }

    async isUserInChat() {
        const chatUser = await prisma.chatUser.findFirst({
            where: {
                userId: this.userid,
            }
        })
        if (chatUser) return chatUser.chatId;
    }

    async joinChat(chatid: string) {
        const a = await prisma.chatUser.create({
            data: {
                userId: this.userid,
                chatId: chatid
            }
        })
    }

    async findMessages(chatid: string) {
        const messages = await prisma.message.findMany({
            where: { chatId: chatid },
            select: {
                text: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        const data = messages.map(message => {
            return {
                text: message.text,
                date: message.date,
                userid: message.user.id,
                name: message.user.name
            }
        })

        return data;
    }

    async findUsersInChat(chatid: string) {
        const users = await prisma.chatUser.findMany({
            where: { chatId: chatid },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        const data = users.map(user => {
            return {
                id: user.user.id,
                name: user.user.name
            }
        })

        return data;
    }

    async createMessage(chatid: string, text: string) {
        const message = await prisma.message.create({
            data: {
                text: text,
                chatId: chatid,
                userId: this.userid,
                date: new Date(),
            },
            select: {
                text: true,
                date: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return {
            text: message.text,
            date: message.date,
            userid: this.userid,
            name: message.user.name
        }
    }
}