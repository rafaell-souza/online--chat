import prisma from "../../prisma/prisma";

export default class TokenCases {
    static async invalidateToken(token: string) {
        await prisma.blackToken.create({
            data: { token: token }
        })
    }

    static async isTokenBlacklisted(token: string) {
        return await prisma.blackToken.findFirst({
            where: { token: token }
        });
    }
}