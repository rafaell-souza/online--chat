import prisma from "../../prisma/prisma";
import IChatObject from "../interfaces/IChatObject";
import { v4 as uuidv4 } from "uuid";

export default class ChatCases {
    userid: string;

    constructor(userid: string) {
        this.userid = userid;
    }

    async findChat(chatid: string) {
        const chat = await prisma.chat.findUnique({
            where: { id: chatid }
        })

        return chat;
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

    async removeUserFromChat(chatid: string, userid?: string) {
        const a = await prisma.chatUser.delete({
            where: {
                userId: userid ? userid : this.userid,
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
                hostId: this.userid,
                language: chatData.language
            }
        })

        return chat.id;
    }

    async isUserInChat(userid?: string) {
        const chatUser = await prisma.chatUser.findFirst({
            where: {
                userId: userid ? userid : this.userid
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

    async getChats() {
        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    none: {
                        userId: this.userid,
                    }
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                capacity: true,
                language: true,
                host: {
                    select: {
                        name: true,
                    }
                },
                blackList: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (chats) {
            return Promise.all(
                chats.map(async (chat) => {
                    const activeUsers = await this.countUsersInChat(chat.id);

                    return {
                        id: chat.id,
                        name: chat.name,
                        description: chat.description,
                        capacity: chat.capacity,
                        language: chat.language,
                        host: chat.host.name,
                        activeUsers: activeUsers,
                        blackList: chat.blackList.map(user => user.userId)
                    };
                })
            );
        }
    }

    async getUserActiveChat() {
        const chat = await prisma.chatUser.findFirst({
            where: { userId: this.userid },
            select: {
                chat: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        capacity: true,
                        language: true,
                        host: {
                            select: {
                                name: true
                            }
                        },
                        blackList: {
                            select: {
                                userId: true
                            }
                        }
                    }
                }
            }
        })

        if (chat) {
            const activeUsers = await this.countUsersInChat(chat.chat.id);
            return {
                id: chat.chat.id,
                name: chat.chat.name,
                description: chat.chat.description,
                capacity: chat.chat.capacity,
                language: chat.chat.language,
                host: chat.chat.host.name,
                activeUsers: activeUsers,
                blackList: chat.chat.blackList.map(user => user.userId)
            }
        }
    }

    async searchChat(query: string, by: string) {
        if (by === "host") {
            const foundHost = await prisma.chat.findMany({
                where: {
                    hostId: {
                        not: this.userid
                    },
                    host: {
                        name: { contains: query }
                    },
                    blackList: {
                        none: {
                            userId: this.userid
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    capacity: true,
                    language: true,
                    host: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            if (foundHost) {

                return Promise.all(
                    foundHost.map(async (chat) => {
                        const activeUsers = await this.countUsersInChat(chat.id);

                        return {
                            id: chat.id,
                            name: chat.name,
                            description: chat.description,
                            capacity: chat.capacity,
                            language: chat.language,
                            host: chat.host.name,
                            activeUsers: activeUsers
                        }
                    })
                )
            }

        } else if (by === "name") {
            const foundHost = await prisma.chat.findMany({
                where: {
                    hostId: { not: this.userid },
                    name: { contains: query },
                    blackList: {
                        none: {
                            userId: this.userid
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    capacity: true,
                    language: true,
                    host: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            if (foundHost) {

                return Promise.all(
                    foundHost.map(async (chat) => {
                        const activeUsers = await this.countUsersInChat(chat.id);

                        return {
                            id: chat.id,
                            name: chat.name,
                            description: chat.description,
                            capacity: chat.capacity,
                            language: chat.language,
                            host: chat.host.name,
                            activeUsers: activeUsers
                        }
                    })
                )
            }
        }
    }
}