import { io } from "./http";
import Joinz from "./SocketEvents/join";
import Message from "./SocketEvents/message";
import CheckHost from "./SocketEvents/CheckHost";
import KickOut from "./SocketEvents/KickOut";

let usersSockets: { userid: string, socket: string }[] = [];

io.on("connection", (socket) => {

    const storeScokets = (userid: string, socket?: string) => {
        const user = usersSockets.find(user => user.userid === userid);
        if (socket) {
            if (user) {
                user.socket = socket;
                return user.socket;
            }
            else {
                usersSockets.push({ userid: userid, socket: socket });
            }
        }

        else if (user && !socket) return user.socket;
    }

    const removeUser = (userid: string) => {
        usersSockets = usersSockets.filter(user => user.userid !== userid);
    }

    Joinz(socket, io, storeScokets);
    Message(socket, io);
    CheckHost(socket, io);
    KickOut(socket, io, storeScokets, removeUser);

    socket.on("disconnect", async () => {
        usersSockets = usersSockets.filter(user => user.socket !== socket.id);
    })
});
