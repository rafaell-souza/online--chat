import { io } from "./http";
import ChatCases from "./UseCases/chat";

type UserData = {
    chatid: string;
    userid: string;
}

type MessageData = {
    chatid: string;
    text: string;
    userId: string;
}

io.on("connection", (socket) => {
    console.log("User connected")

    socket.on("join", async (data: UserData) => {
        await ChatCases.joinChat(data.chatid, data.userid);
        socket.join(data.chatid);

        const messages = await ChatCases.getMessages(data.chatid);
        const users = await ChatCases.getUsersInChat(data.chatid);

       io.to(data.chatid).emit("chat-data", { messages, users });
    })

    socket.on("sendMessage", async (data: MessageData) => {
        const message = await ChatCases.writeMessage(data.chatid, data.userId, data.text);
       io.to(data.chatid).emit("new-message", message);
    })
});
