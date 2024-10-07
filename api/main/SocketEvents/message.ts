import ChatCases from "../UseCases/chat";
import SocketIO from "socket.io";

type MessageData = {
    chatid: string;
    text: string;
    userId: string;
}

export default function Message(
    socket: SocketIO.Socket,
    io: SocketIO.Server,
) {
    socket.on("sendMessage", async (data: MessageData) => {
        const chatCases = new ChatCases(data.userId);

        const isInChat = await chatCases.isUserInChat();
        if (!isInChat || isInChat !== data.chatid) return;

        const message = await chatCases.createMessage(data.chatid, data.text);
        io.to(data.chatid).emit("new-message", message);
    })
}