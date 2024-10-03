import Toolbar from "../components/toolbar";
import { useState, useEffect, useContext } from "react";
import { userData } from "../context/userData";
import { Link } from "react-router-dom";
import { MdLanguage } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdSensorDoor } from "react-icons/md";
import { BiSolidDoorOpen } from "react-icons/bi";

type Chat = {
    id: string;
    name: string;
    description: string;
    capacity: number;
    status: string;
    language: string;
    host: string;
}

type ChatData = {
    chats: Chat[];
    userActiveChat: Chat;
}

const Explore = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [userActiveChat, setUserActiveChat] = useState<Chat>();

    const { user } = useContext(userData);

    useEffect(() => {
        if (user.id) {
        const fetchChats = async () => {
            const response = await fetch(`http://localhost:9000/api/chat/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }
            );

            const data: ChatData = await response.json();
            setChats(data.chats);
            setUserActiveChat(data.userActiveChat);
        }

        fetchChats();
        }
    }, [user]);

    return (
        <>
            <section className="flex h-screen w-full">
                <Toolbar isSelected={0} />

                <section className="w-full px-4 py-6 flex flex-col">

                    {
                        userActiveChat && (
                            <section className="w-full mt-6">
                                <h1 className="text-white">PARTICIPATING</h1>
                                <div className="mt-1 flex flex-col">
                                    {
                                        userActiveChat && (
                                            <div className="border flex bg-gray-900 rounded border-gray-700 p-1 gap-x-1 items-center">
                                                <div className="h-full w-full flex flex-col">
                                                    <h1 className="text-white text-xl">{userActiveChat.name}</h1>
                                                    <p className="text-gray-400 text-xs">{userActiveChat.description}</p>
                                                </div>

                                                <div className="w-full h-full flex flex-col">

                                                    <Link
                                                        to={`/chat/${userActiveChat.id}`}
                                                        className={`${userActiveChat.status === "open" ? "bg-gray-700 hover:bg-gray-600" : "pointer-events-none bg-gray-900"} border border-gray-600 w-full text-white h-6 rounded-lg py-4 justify-center items-center flex`}>Enter in the chat
                                                    </Link>

                                                    <div className="flex mt-2 gap-x-1">
                                                        <p className="text-gray-300 bg-blue-900 px-4 rounded bg-opacity-30 text-xs w-full">{userActiveChat.host}</p>

                                                        <p className="text-gray-300 bg-violet-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 items-center justify-center w-full">
                                                            <MdLanguage className="text-lg" />
                                                            {userActiveChat.language}
                                                        </p>

                                                        <p className="text-gray-300 bg-yellow-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 justify-center items-center w-full">
                                                            <FaPeopleGroup className="text-lg" />
                                                            {userActiveChat.capacity}
                                                        </p>

                                                        <p className={`text-gray-300 ${userActiveChat.status === "open" ? "bg-green-900" : "bg-red-900"} px-3 rounded bg-opacity-30 text-xs w-full flex justify-center flex gap-x-1`}>
                                                            {userActiveChat.status === "open" ? <MdSensorDoor className="text-lg" /> : <BiSolidDoorOpen className="text-lg" />}
                                                            {userActiveChat.status}
                                                        </p>
                                                    </div>
                                                </div>-
                                            </div>
                                        )
                                    }
                                </div>
                            </ section>
                        )
                    }

                    {
                        chats.length > 0 && (
                            <section className="w-full mt-4">
                                <h1 className="text-white">ACTIVE CHATS</h1>
                                <div className="mt-1 flex flex-col h-44 overflow-y-auto">
                                    {
                                        chats.map((chat) => (
                                            <div key={chat.id} className="border flex bg-gray-900 rounded border-gray-700 p-1 gap-x-1">
                                                <div className="h-full w-full flex flex-col">
                                                    <h1 className="text-white">{chat.name}</h1>
                                                    <p className="text-gray-400">{chat.description}</p>
                                                </div>

                                                <div className="w-full h-full flex flex-col">

                                                    <Link
                                                        to={`/chat/${chat.id}`}
                                                        className={`${chat.status === "open" ? "bg-gray-700 hover:bg-gray-600" : "pointer-events-none bg-gray-900"} border border-gray-600 w-full text-white h-6 rounded-lg py-4 justify-center items-center flex`}>Enter in the chat
                                                    </Link>

                                                    <div className="flex mt-2 gap-x-1">
                                                        <p className="text-gray-300 bg-blue-900 px-4 rounded bg-opacity-30 text-xs w-full">{chat.host}</p>

                                                        <p className="text-gray-300 bg-violet-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 items-center justify-center w-full">
                                                            <MdLanguage className="text-lg" />
                                                            {chat.language}
                                                        </p>

                                                        <p className="text-gray-300 bg-yellow-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 justify-center items-center w-full">
                                                            <FaPeopleGroup className="text-lg" />
                                                            {chat.capacity}
                                                        </p>

                                                        <p className={`text-gray-300 ${chat.status === "open" ? "bg-green-900" : "bg-red-900"} px-3 rounded bg-opacity-30 text-xs w-full flex justify-center flex gap-x-1`}>
                                                            {chat.status === "open" ? <MdSensorDoor className="text-lg" /> : <BiSolidDoorOpen className="text-lg" />}
                                                            {chat.status}
                                                        </p>
                                                    </div>
                                                </div>-
                                            </div>
                                        ))
                                    }
                                </div>
                            </section>
                        )
                    }

                </section>
            </section>
        </>
    )
}

export default Explore;