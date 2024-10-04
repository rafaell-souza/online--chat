import { io } from "./http";
import ChatCases from "./UseCases/chat";
import jwt from "jsonwebtoken";
import TokenCases from "./UseCases/token";

type UserData = {
    chatid: string;
    userid: string;
}

type MessageData = {
    chatid: string;
    text: string;
    userId: string;
}

type KickUserOut = {
    token: string;
    userid: string;
    chatid: string
}


io.on("connection", (socket) => {

    socket.on("join", async (data: UserData) => {
        const chatCases = new ChatCases(data.userid);

        const chat = await chatCases.findChat(data.chatid);

        if (!chat || chat?.status === "full") return;

        const usersCount = await chatCases.countUsersInChat(data.chatid);

        if (usersCount >= chat.capacity) {
            await chatCases.closeChat(data.chatid);
            return;
        }

        const isInChat = await chatCases.isUserInChat();

        if (isInChat && isInChat === data.chatid) {
            socket.join(isInChat);

            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);

            io.to(data.chatid).emit("chat-data", { messages, users });

            return;
        }

        else if (isInChat && isInChat !== data.chatid) {
            await chatCases.removeUserFromChat(isInChat);
            socket.leave(isInChat);

            const userChat = await chatCases.findUserChat();

            if (userChat && userChat === isInChat) {
                const countUsersInChat = await chatCases.countUsersInChat(userChat);

                if (countUsersInChat === 0) await chatCases.deleteUserChat();
                else await chatCases.setNewHost(userChat);
            }
        }

        else {
            await chatCases.joinChat(data.chatid);
            socket.join(data.chatid);

            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);

            io.to(data.chatid).emit("chat-data", { messages, users });
        }
    });


    socket.on("sendMessage", async (data: MessageData) => {
        const chatCases = new ChatCases(data.userId);
        const message = await chatCases.createMessage(data.chatid, data.text);

        io.to(data.chatid).emit("new-message", message);
    })


    socket.on("kick-user-out", async (data: KickUserOut) => {
        const host = jwt.decode(data.token) as { id: string, hostFor: string };

        if (host.hostFor !== data.chatid) {
            await TokenCases.invalidateToken(data.token);
            return;
        }

        const chatCases = new ChatCases(host.id);
        await chatCases.removeUserFromChat(data.chatid, data.userid);

        socket.leave(data.chatid)
        socket.disconnect();
        socket.emit("user-kicked-out", data.userid);

        return;
    })


    socket.on("check-host", async (data: { token: string, chatid: string }) => {
        const host = jwt.decode(data.token) as { id: string, hostFor: string };

        if (host.hostFor === data.chatid) {
            socket.emit("host-verified");
            return;
        }

        return;
    });

});