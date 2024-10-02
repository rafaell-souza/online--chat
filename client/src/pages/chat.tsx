import Toolbar from "../components/toolbar";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { userData } from "../context/userData";
import { useRef } from "react";

interface User {
    id: string,
    name: string
}

interface Message {
    text: string;
    date: Date;
    name: string;
    userid: string;
}

interface ChatData {
    messages: Message[];
    users: User[];
}

const socket = io("http://localhost:9000");

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersinChat, setUsersInChat] = useState<User[]>([]);

    const [inputValue, setInputValue] = useState("");

    const { chatid } = useParams();
    const { user } = useContext(userData);

    useEffect(() => {
        if (user.id) {
            socket.emit("join", { chatid: chatid, userid: user.id });
        }

        socket.on("chat-data", (data: ChatData) => {
            setMessages(data.messages);
        
            if (data.users.length > 1) {
                const myIndex = data.users.findIndex(u => u.id === user.id);
        
                [data.users[0], data.users[myIndex]] = [data.users[myIndex], data.users[0]];
        
                setUsersInChat(data.users);
            }
        
            setUsersInChat(data.users);
        });

        socket.on("new-message", (message: Message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off("chat-data");
            socket.off("new-message");
        };
    }, [user]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        socket.emit("sendMessage", { chatid: chatid, text: inputValue, userId: user.id });

        setInputValue("");
    }

    const lastMessage = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <>
            <section className="flex h-screen w-full">
                <Toolbar isSelected={2} />
                <section className="w-full flex px-2 py-6">

                    <div className="h-full w-full flex flex-col justify-end px-2 py-1">
                        <div className="h-full rounded mb-1 pb-2 overflow-y-auto scrollbar">
                            {
                                messages.map((message, index) => {
                                    return (
                                        <div
                                            ref={index === messages.length - 1 ? lastMessage : null}
                                            key={index}
                                            className="flex gap-x-2 mt-3">
                                            {
                                                <>
                                                    <FaUserCircle className="text-3xl text-white" />

                                                    <div className="flex flex-col">
                                                        <span className={`text-xs text-blue-500`}>{message.name}</span>

                                                        <span className={`text-sm px-2 py-1 mt-1 rounded-lg ${message.userid === user.id ? "bg-gray-900" : ""} text-white`}>{message.text}</span>
                                                    </div>
                                                </>

                                            }

                                        </div>
                                    )
                                })
                            }
                        </div>

                        <form
                            onSubmit={handleSendMessage}
                            className="flex gap-x-1 w-full">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full rounded h-6 px-2 text-sm outline-none bg-gray-900 text-white border border-gray-800"
                                placeholder="message" />

                            <button className="text-white bg-gray-800 hover:bg-gray-700 px-10 rounded">send</button>
                        </form>
                    </div>

                    <div className="h-full w-60 flex flex-col mx-1 px-2 border-l border-gray-900">
                        <div className="bg-gray-800 text-white text-sm rounded px-2 py-1">Users</div>
                        <div className="overflow-y-auto h-full">
                            {
                                usersinChat.map((userChat, index) => {
                                    return (
                                        <div key={index} className={`flex px-2 py-1 gap-x-2 mt-2 ${userChat.id === user.id ? 'bg-gray-900 rounded' : ""}`}>
                                            <FaUserCircle className="text-xl text-white" />
                                            <span className="text-white text-xs">{userChat.name}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                </section>
            </section>
        </>
    )
}

export default Chat;