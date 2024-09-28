import { io } from "./http";
import prisma from "../prisma/prisma";
import IChatObject from "./interfaces/IChatObject";
import jwt from "jsonwebtoken";
import chatSchema from "./schemas/Chat";
import "dotenv/config";
import { v4 as uuid } from "uuid";

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Authentication error"))

    try {
        const isBlacklisted = await prisma.blackToken.findFirst({ where: { token: token } })
        if (isBlacklisted) return next(new Error("Authentication error"))

        const userId = jwt.decode(token) as { id: string }
        const user = await prisma.user.findUnique({ where: { id: userId.id } })

        if (!user) return next(new Error("Authentication error"))

        jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
            if (err) return next(new Error("Authentication error"))
        })

        next()

    } catch (error) {
        return next(new Error("Authentication error"))
    }
})

io.on("connection", socket => {

    socket.on("create-room", async (data: IChatObject) => {
        data.capacity = Number(data.capacity)
        if (chatSchema.safeParse(data).success) {
            const user = jwt.decode(data.token) as { id: string }

            const haveChat = await prisma.chat.findFirst({ where: { hostId: user.id } })

            if (haveChat) await prisma.chat.delete({ where: { id: haveChat.id } })

            const chat = await prisma.chat.create({
                data: {
                    id: uuid(),
                    name: data.name,
                    description: data.description,
                    capacity: data.capacity,
                    language: data.language,
                    status: "open",
                    hostId: user.id,
                    users: {
                        create: {
                            userId: user.id
                        }
                    }
                }
            })

            socket.join(chat.id)
        }
        else {
            socket.emit("create-room-error", chatSchema.safeParse(data).error)
        }
    })

})