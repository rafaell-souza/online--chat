import Toolbar from "../components/toolbar";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { userData } from "../context/userData";
import { useRef } from "react";
import { formatDistanceStrict } from "date-fns";
import { useNavigate } from "react-router-dom";

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

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersinChat, setUsersInChat] = useState<User[]>([]);
    const [blackList, setBlackList] = useState<BlackList[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [userWasKicked, setUserWasKicked] = useState(false);

    const { chatid } = useParams();

    const { user } = useContext(userData);

    const navigate = useNavigate();

    useEffect(() => {
        if (chatid) localStorage.setItem("chatid", chatid);
        else localStorage.removeItem("chatid");
    }, [chatid]);

    useEffect(() => {
        const socket = io("http://localhost:9000");

        if (user.id && chatid) {
            socket.emit("join", { chatid: chatid, userid: user.id });

            socket.on("chat-data", (data: ChatData) => {
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

            socket.on("update-data", (data: ChatData) => {
                setUsersInChat(data.users);
            })

            socket.on("new-message", (message: Message) => {
                setMessages(prev => [...prev, {
                    ...message,
                    date: formatDistanceStrict(new Date(message.date), new Date(), { addSuffix: true })
                }]);
            });

            socket.emit("check-host", { token: localStorage.getItem("token"), chatid: chatid });

            socket.on("host-verified", () => {
                setIsHost(true);
            });

            socket.on("kicked-out", () => {
                setUserWasKicked(true);
                localStorage.removeItem("chatid");
            })
        }

        return () => {
            socket.off("chat-data");
            socket.off("new-message");
            socket.off("host-verified");
            socket.off("kicked-out");
            socket.off("update-data");
            socket.disconnect();
        };
    }, [user.id, chatid]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const socket = io("http://localhost:9000");

        socket.emit("sendMessage", {
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
        const socket = io("http://localhost:9000");

        const data = {
            userid: userid,
            chatid: chatid,
            token: localStorage.getItem("token")
        }
        socket.emit("kick-out", data);

    }

    const RemoveFromBlackList = (userid: string) => {
        const socket = io("http://localhost:9000");

        const data = {
            chatid: chatid,
            userid: userid,
            token: localStorage.getItem("token")
        }
        socket.emit("remove-from-blacklist", data);
    }

    console.log(usersinChat);
    
    return (
        <>
            <section className="flex h-screen w-full">
                <Toolbar isSelected={2} />
                <section className="w-full flex px-2 py-3 relative">

                    {
                        userWasKicked && (
                            <div className="absolute flex justify-center items-center inset-0 backdrop-blur-lg z-30">
                                <div className="flex flex-col text-white bg-gray-900 p-2 rounded-lg">
                                    <span className="px-4 text-white py-2 rounded">
                                        You were kicked out of the chat
                                    </span>
                                    <button
                                        onClick={() => navigate("/")}
                                        className="w-full text-center bg-gray-800 hover:bg-gray-700 rounded px-2 py-1"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    <div className="h-full w-full flex flex-col justify-end px-2 py-1">
                        <div className="h-full rounded mb-1 w-full pb-2 overflow-y-auto scrollbar">
                            {
                                messages.map((message, index) => {
                                    return (
                                        <div
                                            ref={index === messages.length - 1 ? lastMessage : null}
                                            key={index}
                                            className={`flex gap-x-2 mt-3 ${message.userid === user.id ? "justify-end" : ""}`}>
                                            {
                                                <>
                                                    {
                                                        message.userid !== user.id ? (
                                                            <>
                                                                <FaUserCircle className={`text-3xl text-white`} />

                                                                <div className={`flex max-w-80 flex-col py-1 rounded-lg relative bg-gray-950 border border-gray-900`}>

                                                                    <span className={`text-xs pl-2 text-blue-500`}>{message.name}</span>

                                                                    <span className={`text-sm pl-2 pr-6 text-white break-words`}>{message.text}</span>

                                                                    <span className={`text-[10px] px-2 text-gray-500`}>{message.date}</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className={`flex max-w-80 flex-col py-1 rounded-lg bg-gray-900`}>

                                                                    <span className={`text-sm pl-2 pr-6 text-white break-words`}>{message.text}</span>

                                                                    <span className={`text-[10px] px-2 text-gray-500 text-right`}>{message.date}</span>
                                                                </div>
                                                                <FaUserCircle className={`text-3xl text-white`} />
                                                            </>
                                                        )
                                                    }
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
                                placeholder="Message..." />

                            <button className="text-white bg-gray-800 hover:bg-gray-700 px-10 rounded">send</button>
                        </form>
                    </div>

                    <div className="h-full w-56 flex flex-col mx-1 px-2 border-l border-gray-900">
                        <div className="bg-gray-800 text-white text-sm rounded px-2 py-1">Users</div>
                        <div className={`overflow-y-auto h-full scrollbar`}>
                            {
                                usersinChat.map((userChat, index) => {
                                    return (
                                        <div key={index} className={`flex p-1 ${isHost && userChat.id !== user.id ? "justify-between" : "gap-x-2"} items-center mt-2 ${userChat.id === user.id ? 'bg-gray-900 rounded' : ""}`}>
                                            <FaUserCircle className="text-xl text-white" />
                                            <span className="text-white break-words text-xs">{userChat.name}</span>

                                            {
                                                isHost && userChat.id !== user.id && (
                                                    <button
                                                        onClick={() => handleKickOut(userChat.id)}
                                                        className={`bg-blue-950 hover:bg-blue-900 rounded px-2 text-white text-xs`}>
                                                        kick out
                                                    </button>
                                                )
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {
                            isHost && blackList.length > 0 && (
                                <>
                                    <div className="bg-gray-800 text-white text-sm rounded px-2 py-1 mt-2">Blacklist</div>
                                    <div className="overflow-y-auto h-44 scrollbar">
                                        {
                                            blackList.map((userChat, index) => {
                                                return (
                                                    <div key={index} className={`flex p-1 ${isHost ? "justify-between" : "gap-x-2"} items-center mt-2 ${userChat.userId === user.id ? 'bg-gray-900 rounded' : ""}`}>
                                                        <FaUserCircle className="text-xl text-white" />
                                                        <span className="text-white break-words text-xs">{userChat.name}</span>

                                                        <button
                                                            onClick={() => RemoveFromBlackList(userChat.userId)}
                                                            className={`bg-blue-950 hover:bg-blue-900 rounded px-2 text-white text-xs`}>
                                                            remove
                                                        </button>

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            )
                        }
                    </div>

                </section>
            </section>
        </>
    )
}

export default Chat;