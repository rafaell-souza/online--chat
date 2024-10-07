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

        const chat = await chatCases.findChat(data.chatid);
        if (!chat) return;

        const isInChat = await chatCases.isUserInChat();

        if (isInChat && isInChat === data.chatid) {
            storeScokets(data.userid, socket.id);
            socket.join(data.chatid);

            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);

            io.to(data.chatid).emit("chat-data", { messages, users });

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
        }

        const userChat = await chatCases.findUserChat();

        if (userChat && userChat === isInChat) {
            const countUsersInChat = await chatCases.countUsersInChat(userChat);

            if (countUsersInChat === 0) await chatCases.deleteUserChat();
            else await chatCases.setNewHost(userChat);
        }

        else {
            const isUserOnBlackList = new ChatBlackListCases();
            const blackList = await isUserOnBlackList.getUserBlackList(data.chatid);

            const isUserOnBlacklist = blackList.find(user => user.userId === data.userid);

            if(isUserOnBlacklist) {
                socket.emit("kicked-out");
                return;
            }

            await chatCases.joinChat(data.chatid);
            storeScokets(data.userid, socket.id);
            socket.join(data.chatid);

            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);

            io.to(data.chatid).emit("chat-data", { messages, users });
        }
    });

}