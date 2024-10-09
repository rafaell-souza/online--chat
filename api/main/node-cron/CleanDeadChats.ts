import cron from "node-cron";
import prisma from "../../prisma/prisma";

cron.schedule("0 */12 * * *", async () => {
    const chats = await prisma.chat.findMany({
        where: {
            date: {
                lt: new Date(Date.now() - 1000 * 60 * 60 * 12)
            }
        }
    });

    if (chats.length > 0) {
        for (const chat of chats) {
            await prisma.chat.delete({
                where: {
                    id: chat.id
                }
            });
        }
    }
    return;
})