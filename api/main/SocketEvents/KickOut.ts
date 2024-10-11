import ChatCases from "../UseCases/chat";
import TokenCases from "../UseCases/token";
import ChatBlackListCases from "../UseCases/ChatBlackList";
import SocketIO from "socket.io";

type KickUserOut = {
    chatid: string;
    kickid: string;
    userid: string;
    token: string;
}

export default function KickOut(
    socket: SocketIO.Socket,
    io: SocketIO.Server,
    storeScokets: (userid: string, socket?: string) => string | undefined,
    removeUser: (userid: string) => void,
) {
    socket.on("kick-out", async (data: KickUserOut) => {

        const chatCases = new ChatCases(data.userid);
        const isHost = await chatCases.findUserChat();

        if (isHost && isHost !== data.chatid) {
            const userSocket = storeScokets(data.kickid);
            if (userSocket) {
                io.sockets.sockets.get(userSocket)?.emit("kicked-out");
                io.sockets.sockets.get(userSocket)?.leave(data.chatid);
            }
            removeUser(data.userid);

            const blackListCases = new ChatBlackListCases();
            await blackListCases.putUserOnBlackList(data.chatid, data.kickid);

            await TokenCases.invalidateToken(data.token);
            return;
        }

        const isUserInChat = await chatCases.isUserInChat(data.kickid);

        if (isUserInChat) {
            await chatCases.removeUserFromChat(data.chatid, data.kickid);

            const userSocket = storeScokets(data.kickid);

            if (userSocket) {
                io.sockets.sockets.get(userSocket)?.emit("kicked-out");
                io.sockets.sockets.get(userSocket)?.leave(data.chatid);
            }
            removeUser(data.userid);

            const blackListCases = new ChatBlackListCases();
            const blacklist = await blackListCases.getUserBlackList(data.chatid);

            const isUserOnBlacklist = blacklist?.find(user => user.userId === data.kickid);

            if (!isUserOnBlacklist) {
                await blackListCases.putUserOnBlackList(data.chatid, data.kickid);

                const users = await chatCases.findUsersInChat(data.chatid);
                const newblacklist = await blackListCases.getUserBlackList(data.chatid);
    
                io.to(data.chatid).emit("update-data", { users });
                io.to(data.chatid).emit("update-blacklist", newblacklist );
            }
        }
    })
}