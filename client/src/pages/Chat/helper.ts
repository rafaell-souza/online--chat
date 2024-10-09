import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { userData } from "../../context/userData";
import { useRef } from "react";
import { formatDistanceStrict } from "date-fns";
import { useNavigate } from "react-router-dom";
import * as SocketIo from "socket.io-client";

interface BlackList {
    userId: string;
    chatId: string;
    name: string;
}

interface User {
    id: string,
    name: string
}

interface Message {
    text: string;
    date: string
    name: string;
    userid: string;
}

interface ChatData {
    messages: Message[];
    users: User[];
    blackList: BlackList[];
}
   
const ChatHelper = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersinChat, setUsersInChat] = useState<User[]>([]);
    const [blackList, setBlackList] = useState<BlackList[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [userWasKicked, setUserWasKicked] = useState(false);
    const socket = useRef<SocketIo.Socket | null>(null);

    const { chatid } = useParams();

    const { user } = useContext(userData);

    const navigate = useNavigate();

    useEffect(() => {
        if (chatid) sessionStorage.setItem("chatid", chatid);
        else sessionStorage.removeItem("chatid");
    }, [chatid]);

    useEffect(() => {
        socket.current = io("http://localhost:9000", {
            auth: {
                token: localStorage.getItem("token")
            }
        });

        if (user.id && chatid) {
            socket.current.emit("join", { chatid: chatid, userid: user.id });

            socket.current.on("chat-data", (data: ChatData) => {
                setMessages(
                    data.messages.map(message => {
                        return {
                            ...message,
                            date: formatDistanceStrict(new Date(message.date), new Date(), { addSuffix: true })
                        }
                    })
                );

                const myIndex = data.users.findIndex(u => u.id === user.id);

                [data.users[0], data.users[myIndex]] = [data.users[myIndex], data.users[0]];

                setUsersInChat(data.users);

                setBlackList(data?.blackList?.length > 0 ? data.blackList : []);
            });

            socket.current.on("update-data", (data: ChatData) => {
                setUsersInChat(data.users);
            })

            socket.current.on("update-blacklist", (data: BlackList[]) => {
                setBlackList(data);
            });

            socket.current.on("new-message", (message: Message) => {
                setMessages(prev => [...prev, {
                    ...message,
                    date: formatDistanceStrict(new Date(message.date), new Date(), { addSuffix: true })
                }]);
            });

            socket.current.emit("check-host", { token: localStorage.getItem("token"), chatid: chatid });

            socket.current.on("host-verified", () => {
                setIsHost(true);
            });

            socket.current.on("kicked-out", () => {
                setUserWasKicked(true);
                sessionStorage.removeItem("chatid");
            })
        }

        return () => {
            socket.current?.off("chat-data");
            socket.current?.off("new-message");
            socket.current?.off("host-verified");
            socket.current?.off("kicked-out");
            socket.current?.off("update-data");
            socket.current?.off("update-blacklist");
            socket.current?.disconnect();
        };
    }, [user.id, chatid]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        socket.current?.emit("sendMessage", {
            chatid: chatid,
            text: inputValue,
            userId: user.id
        });

        setInputValue("");
    }

    const lastMessage = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleKickOut = (userid: string) => {
        const data = {
            userid: userid,
            chatid: chatid,
            token: localStorage.getItem("token")
        }
        socket.current?.emit("kick-out", data);

    }

    const RemoveFromBlackList = (userid: string) => {
        const data = {
            chatid: chatid,
            userid: userid,
            token: localStorage.getItem("token")
        }
        socket.current?.emit("remove-from-blacklist", data);
    }

    return {
        messages,
        usersinChat,
        blackList,
        inputValue,
        isHost,
        userWasKicked,
        handleSendMessage,
        lastMessage,
        handleKickOut,
        RemoveFromBlackList,
        setInputValue,
        user,
        navigate
    }
}

export default ChatHelper;