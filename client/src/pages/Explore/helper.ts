import { useState, useEffect, useContext } from "react";
import { userData } from "../../context/userData";

type Chat = {
    id: string;
    name: string;
    description: string;
    capacity: number;
    language: string;
    host: string;
    activeUsers: number;
    blackList: string[];
}

type ChatData = {
    chats: Chat[];
    userActiveChat: Chat;
}

const ExploreHelper = () => {
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
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
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

    return {
        chats,
        userActiveChat,
        user
    }
}

export default ExploreHelper;