import * as SocketIO from "socket.io";
import jwt from "jsonwebtoken";
import ChatBlackListCases from "../UseCases/ChatBlackList";
import TokenCases from "../UseCases/Token";

type BlackListdata = {
    chatid: string;
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

        const chatBlackListCases = new ChatBlackListCases();
        const isBlackListed = await chatBlackListCases.isUserBlackListed(data.chatid, data.userid);

        if (isBlackListed) await chatBlackListCases.removeUserFromBlackList(isBlackListed); 
    });
}