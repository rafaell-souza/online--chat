import SocketIO from "socket.io";
import ChatCaases from "../UseCases/chat";

export default function CheckHost (
    socket: SocketIO.Socket,
) {
    socket.on("check-host", async (data: { userid: string, chatid: string }) => {

        const userCases = new ChatCaases(data.userid);
        const isHost = await userCases.findUserChat();

        if (isHost && isHost === data.chatid) socket.emit("host-verified");
    });
}