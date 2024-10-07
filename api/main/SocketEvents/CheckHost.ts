import jwt from "jsonwebtoken";
import SocketIO from "socket.io";

export default function CheckHost (
    socket: SocketIO.Socket,
    io: SocketIO.Server,
) {
    socket.on("check-host", async (data: { token: string, chatid: string }) => {
        const host = jwt.decode(data.token) as { id: string, hostFor: string };

        if (host.hostFor === data.chatid) {
            socket.emit("host-verified");
        }
    });
}