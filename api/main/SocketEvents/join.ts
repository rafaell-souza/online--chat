import ChatCases from "../UseCases/chat";
import ChatBlackListCases from "../UseCases/ChatBlackList";
import SocketIO from "socket.io";

type UserData = {
    chatid: string;
    userid: string;
}

export default function Join(
    socket: SocketIO.Socket,
    io: SocketIO.Server,
    storeScokets: (userid: string, socket?: string) => string | undefined,
) {

    socket.on("join", async (data: UserData) => {

        const chatCases = new ChatCases(data.userid);
        const blackListCases = new ChatBlackListCases();

        const chat = await chatCases.findChat(data.chatid);
        if (!chat) return;

        const isInChat = await chatCases.isUserInChat();

        if (isInChat && isInChat === data.chatid) {
            storeScokets(data.userid, socket.id);
            socket.join(data.chatid);

            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);
            const blackList = await blackListCases.getUserBlackList(data.chatid);

            io.to(data.chatid).emit("chat-data", { messages, users, blackList });
            return;
        }

        else if (isInChat && isInChat !== data.chatid) {

            const countUsersInChat = await chatCases.countUsersInChat(data.chatid);
            if (countUsersInChat >= chat.capacity) return;

            await chatCases.removeUserFromChat(isInChat);

            const userSocket = storeScokets(data.userid);
            if (userSocket) {
                io.sockets.sockets.get(userSocket)?.leave(isInChat);
            }

            const users = await chatCases.findUsersInChat(isInChat);
            io.to(isInChat).emit("update-data", { users });
        }

        const userChat = await chatCases.findUserChat();

        if (userChat && userChat === isInChat) {
            const countUsersInChat = await chatCases.countUsersInChat(userChat);

            if (countUsersInChat === 0) await chatCases.deleteUserChat();
            else await chatCases.setNewHost(userChat);
        }

        const blackListed = await blackListCases.isUserBlackListed(data.chatid, data.userid);

        if (blackListed) {
            const userSocket = storeScokets(data.userid);

            if (userSocket) {
                io.sockets.sockets.get(userSocket)?.emit("kicked-out");
                io.sockets.sockets.get(userSocket)?.leave(data.chatid);
            }
            return;
        }

        await chatCases.joinChat(data.chatid);
        storeScokets(data.userid, socket.id);
        socket.join(data.chatid);

        const messages = await chatCases.findMessages(data.chatid);
        const users = await chatCases.findUsersInChat(data.chatid);
        const blackList = await blackListCases.getUserBlackList(data.chatid);

        socket.emit("chat-data", { messages, users, blackList });
        io.to(data.chatid).emit("update-data", { users });
    }
    );

}