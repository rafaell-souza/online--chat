import ChatCases from "../UseCases/chat";
import jwt from "jsonwebtoken";
import TokenCases from "../UseCases/token";
import ChatBlackListCases from "../UseCases/ChatBlackList";
import SocketIO from "socket.io";

type KickUserOut = {
    token: string;
    userid: string;
    chatid: string
}

export default function KickOut(
    socket: SocketIO.Socket,
    io: SocketIO.Server,
    storeScokets: (userid: string, socket?: string) => string | undefined,
    removeUser: (userid: string) => void,
) {
    socket.on("kick-out", async (data: KickUserOut) => {
        const host = jwt.decode(data.token) as { id: string, hostFor: string };

        if (host.hostFor !== data.chatid) {
            const userSocket = storeScokets(data.userid);
            if (userSocket) {
                io.sockets.sockets.get(userSocket)?.emit("kicked-out");
                io.sockets.sockets.get(userSocket)?.leave(data.chatid);
            }
            removeUser(data.userid);

            const blackListCases = new ChatBlackListCases();
            await blackListCases.putUserOnBlackList(data.chatid, host.id);

            await TokenCases.invalidateToken(data.token);
            return;
        }

        const chatCases = new ChatCases(host.id);

        const isUserInChat = await chatCases.isUserInChat(data.userid);

        if (isUserInChat) {
            await chatCases.removeUserFromChat(data.chatid, data.userid);

            const userSocket = storeScokets(data.userid);

            if (userSocket) {
                io.sockets.sockets.get(userSocket)?.emit("kicked-out");
                io.sockets.sockets.get(userSocket)?.leave(data.chatid);
            }
            removeUser(data.userid);

            const blackListCases = new ChatBlackListCases();
            const blacklist = await blackListCases.getUserBlackList(data.chatid);

            const isUserOnBlacklist = blacklist?.find(user => user.userId === data.userid);

            if (!isUserOnBlacklist) {
                await blackListCases.putUserOnBlackList(data.chatid, data.userid);

                const users = await chatCases.findUsersInChat(data.chatid);
                const newblacklist = await blackListCases.getUserBlackList(data.chatid);
    
                io.to(data.chatid).emit("update-data", { users });
                io.to(data.chatid).emit("update-blacklist", newblacklist );
            }
        }
    })
}