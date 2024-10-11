import * as SocketIO from "socket.io";
import ChatBlackListCases from "../UseCases/ChatBlackList";
import TokenCases from "../UseCases/token";
import ChatCases from "../UseCases/chat";

type BlackListdata = {
    chatid: string;
    kickid: string;
    userid: string;
    token: string;
}

export default function RemoveFromBlackList(
    socket: SocketIO.Socket,
    io: SocketIO.Server,
    storeScokets: (userid: string, socket?: string) => string | undefined,
    removeUser: (userid: string) => void
) {
    socket.on("remove-from-blacklist", async (data: BlackListdata) => {

        const chatCases = new ChatCases(data.userid);
        const host = await chatCases.findUserChat();

        if (host && host !== data.chatid) {
            const userSocket = storeScokets(data.userid);
            if (userSocket) {
                io.sockets.sockets.get(userSocket)?.emit("kicked-out");
                io.sockets.sockets.get(userSocket)?.leave(data.chatid);
            }
            removeUser(data.userid);

            const blackListCases = new ChatBlackListCases();
            await blackListCases.putUserOnBlackList(data.chatid, data.userid);

            await TokenCases.invalidateToken(data.token);
            return;
        }

        const chatBlackListCases = new ChatBlackListCases();
        const isBlackListed = await chatBlackListCases.isUserBlackListed(data.chatid, data.kickid);

        if (isBlackListed) {
            await chatBlackListCases.removeUserFromBlackList(isBlackListed); 
            const newblacklist = await chatBlackListCases.getUserBlackList(data.chatid);
            io.to(data.chatid).emit("update-blacklist", { newblacklist });
        }
    });
}