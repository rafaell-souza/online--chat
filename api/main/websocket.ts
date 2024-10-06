import { io } from "./http";
import ChatCases from "./UseCases/chat";
import jwt from "jsonwebtoken";
import TokenCases from "./UseCases/token";
import ChatBlackListCases from "./UseCases/ChatBlackList";

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

let usersSockets: { userid: string, socket: string }[] = [];

io.on("connection", (socket) => {

    socket.on("join", async (data: UserData) => {
        const chatCases = new ChatCases(data.userid);

        const chat = await chatCases.findChat(data.chatid);
        if (!chat) return;

        const isInChat = await chatCases.isUserInChat();

        if (isInChat && isInChat === data.chatid) {
            const findUser = usersSockets.find(user => user.userid === data.userid);
            if (findUser) findUser.socket = socket.id;

            socket.join(data.chatid);

            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);

            io.to(data.chatid).emit("chat-data", { messages, users });

            return;
        }

        else if (isInChat && isInChat !== data.chatid) {
            await chatCases.removeUserFromChat(isInChat);

            const userSocket = usersSockets.find(user => user.userid === data.userid);
            if (userSocket) {
                userSocket.socket = socket.id;
                io.sockets.sockets.get(userSocket.socket)?.leave(isInChat);
            }

            const userChat = await chatCases.findUserChat();

            if (userChat && userChat === isInChat) {
                const countUsersInChat = await chatCases.countUsersInChat(userChat);

                if (countUsersInChat === 0) await chatCases.deleteUserChat();
                else await chatCases.setNewHost(userChat);
            }
        }

        else {
            const isUserOnBlackList = new ChatBlackListCases();
            const blackList = await isUserOnBlackList.getUserBlackList(data.chatid);

            const isUserOnBlacklist = blackList.find(user => user.userId === data.userid);

            console.log(isUserOnBlacklist);

            if (isUserOnBlacklist) {
                socket.emit("kicked-out");
                return;
            }

            await chatCases.joinChat(data.chatid);

            usersSockets.push({ userid: data.userid, socket: socket.id });
            socket.join(data.chatid);

            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);

            io.to(data.chatid).emit("chat-data", { messages, users });
        }
    });


    socket.on("sendMessage", async (data: MessageData) => {
        const chatCases = new ChatCases(data.userId);

        const isInChat = await chatCases.isUserInChat();
        if (!isInChat || isInChat !== data.chatid) return;

        const message = await chatCases.createMessage(data.chatid, data.text);
        io.to(data.chatid).emit("new-message", message);
    })


    socket.on("kick-out", async (data: KickUserOut) => {
        const host = jwt.decode(data.token) as { id: string, hostFor: string };

        if (host.hostFor !== data.chatid) {
            const userSocket = usersSockets.find(user => user.userid === host.id);
            if (userSocket) {
                io.sockets.sockets.get(userSocket.socket)?.emit("kicked-out");
                io.sockets.sockets.get(userSocket.socket)?.leave(data.chatid);
            }

            const blackListCases = new ChatBlackListCases();
            await blackListCases.putUserOnBlackList(data.chatid, host.id);

            await TokenCases.invalidateToken(data.token);
            return;
        }

        const chatCases = new ChatCases(host.id);

        const isUserInChat = await chatCases.isUserInChat(data.userid);

        if (isUserInChat) {
            await chatCases.removeUserFromChat(data.chatid, data.userid);
            const userSocket = usersSockets.find(user => user.userid === data.userid);
            if (userSocket) {
                io.sockets.sockets.get(userSocket.socket)?.emit("kicked-out");
                io.sockets.sockets.get(userSocket.socket)?.leave(data.chatid);
            }

            const blackListCases = new ChatBlackListCases();
            const isUserOnBlackList = await blackListCases.getUserBlackList(data.chatid);

            const isUserOnBlacklist = isUserOnBlackList.find(user => user.userId === data.userid);

            if (!isUserOnBlacklist) {
                await blackListCases.putUserOnBlackList(data.chatid, data.userid);
            }

            return;
        }
    })


    socket.on("check-host", async (data: { token: string, chatid: string }) => {
        const host = jwt.decode(data.token) as { id: string, hostFor: string };

        if (host.hostFor === data.chatid) {
            socket.emit("host-verified");
            return;
        }
    });

    socket.on("disconnect", async () => {
        usersSockets = usersSockets.filter(user => user.socket !== socket.id);
    })

});
