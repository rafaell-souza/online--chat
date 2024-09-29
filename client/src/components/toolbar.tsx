import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Toolbar = ({ isSelected }: { isSelected: number }) => {
    const [currentChat, setCurrentChat] = useState<string>("")
    const [error, setError] = useState<boolean>(true)

    useEffect(() => {
        const socket = io("http://localhost:9000", {
            auth: {
                token: localStorage.getItem("token")
            }
        })

        socket.on("connect_error", () => {
            setError(true)
        })

        socket.emit("get-chat", localStorage.getItem("token"))
        socket.on("get-chat-success", (chatId: string) => setCurrentChat(chatId))
        socket.on("get-chat-error", () => setError(true))

    }, [])

    return (
        <section className="border-r border-zinc-900 pt-4 px-2 flex flex-col gap-y-1 bg-black bg-opacity-10 w-48 h-screen">

            <div className="flex items-center mt-4 flex-col">
                <FaUserCircle className="text-4xl text-white" />
                <p className="text-gray-500 text-sm mt-1 text-center">John Doe</p>
            </div>

            <Link to="/new-room"
                className={`border mt-5 text-white text-xs flex items-center justify-center border-gray-900 w-full h-7 ${isSelected === 1 ? "bg-gray-900" : ""}`}>
                NEW ROOM
            </Link>

            <Link to={`/`}
                className={`border text-white text-xs flex items-center justify-center border-gray-900 w-full h-7 ${isSelected === 0 ? "bg-gray-900" : ""}`}>
                EXPLORE
            </Link>

            <Link to={`/chat/${currentChat}`}
                className={`border text-white ${error ? "pointer-events-none opacity-50" : ""} text-xs flex items-center justify-center border-gray-900 w-full h-7 ${isSelected === 2 ? "bg-gray-900" : ""}`}>
                CHAT
            </Link>

        </section>
    )
}

export default Toolbar;