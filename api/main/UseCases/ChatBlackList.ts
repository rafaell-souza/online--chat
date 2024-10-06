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
        return await prisma.chatBlackList.findMany({
            where: {
                chatId: chatid
            },
            select: {
                userId: true,
                chatId: true
            }
        })
    }
}