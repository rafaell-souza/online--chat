import { io } from "./http";
import Joinz from "./SocketEvents/join";
import Message from "./SocketEvents/message";
import CheckHost from "./SocketEvents/CheckHost";
import KickOut from "./SocketEvents/KickOut";
import RemoveFromBlackList from "./SocketEvents/RemoveFromBlackList";
import SocketConnectionValidation from "./middlewares/SocketConnectionValidation";

let usersSockets: { userid: string, socket: string }[] = [];

// Add authentication middleware - complete
// Improve input data validation and versatility - complete
// Add input validation details on interface to the fianl user - complete
// Add errors messages to the final user - complete
// add logout functionality 

io.use(SocketConnectionValidation);
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

    CheckHost(socket, io);
    Joinz(socket, io, storeScokets);
    Message(socket, io);
    KickOut(socket, io, storeScokets, removeUser);
    RemoveFromBlackList(socket, io, storeScokets, removeUser);

    socket.on("disconnect", async () => {
        usersSockets = usersSockets.filter(user => user.socket !== socket.id);
    })
});
