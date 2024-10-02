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

    socket.on("join", async (data: UserData) => {
        const chatCases = new ChatCases(data.userid);
        
        const isInChat = await chatCases.isUserInChat();
    
        if (isInChat && isInChat === data.chatid) {
            socket.join(isInChat);
    
            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);
    
            io.to(data.chatid).emit("chat-data", { messages, users });

            return;
        }
    
        else if (isInChat && isInChat !== data.chatid) {
            await chatCases.removeUserFromChat(isInChat);
            socket.leave(isInChat);
    
            const userChat = await chatCases.findUserChat();
        
            if (userChat && userChat === isInChat) {
                const countUsersInChat = await chatCases.countUsersInChat(userChat);
    
                if (countUsersInChat === 0) await chatCases.deleteUserChat();
                else await chatCases.setNewHost(userChat);
            }
        }

        else {
            await chatCases.joinChat(data.chatid);
            socket.join(data.chatid);
        
            const messages = await chatCases.findMessages(data.chatid);
            const users = await chatCases.findUsersInChat(data.chatid);
        
            io.to(data.chatid).emit("chat-data", { messages, users });
        }
    });
    

    socket.on("sendMessage", async (data: MessageData) => {
        const chatCases = new ChatCases(data.userId);
        const message = await chatCases.createMessage(data.chatid, data.text);

        io.to(data.chatid).emit("new-message", message);
    })
});