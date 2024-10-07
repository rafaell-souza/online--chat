import prisma from "../../prisma/prisma";

export default class ChatBlackListCases {
    async putUserOnBlackList(chatid: string, userid: string) {
        await prisma.chatBlackList.create({
            data: {
                chatId: chatid,
                userId: userid
            }
        })
    }

    async getUserBlackList(chatid: string) {
        const data = await prisma.chatBlackList.findMany({
            where: {
                chatId: chatid
            },
            select: {
                userId: true,
                chatId: true,
                user: {
                    select: {
                        name: true,
                    }
                }
            }
        })

        if (data) {
            return data.map((item) => {
                return {
                    userId: item.userId,
                    chatId: item.chatId,
                    name: item.user.name
                }
            })
        }
    }

    async removeUserFromBlackList(id: number) {
        await prisma.chatBlackList.delete({
            where: { id: id }
        })
    }

    async isUserBlackListed(chatid: string, userid: string) {
        const data = await prisma.chatBlackList.findFirst({
            where: {
                chatId: chatid,
                userId: userid
            }
        })

        if (data) return data.id;
    }
}