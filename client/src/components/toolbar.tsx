import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { userData } from "../context/userData";
import { useEffect } from "react";

const Toolbar = ({ isSelected }: { isSelected: number }) => {
    const { user, setUser } = useContext(userData);

    useEffect(() => {
        async function fetchUser() {
            const response = await fetch("http://localhost:9000/api/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setUser(data);
        }
        fetchUser();
    }, []);

    return (
        <section className="border-r border-zinc-900 pt-4 px-2 flex flex-col gap-y-1 bg-black bg-opacity-10 w-48 h-screen">

            <div className="flex items-center mt-4 flex-col">
                <FaUserCircle className="text-4xl text-white" />
                <p className="text-gray-500 text-sm mt-1 text-center">{user.name}</p>
            </div>

            <Link to="/new-room"
                className={`border mt-5 text-white text-xs flex items-center justify-center border-gray-900 w-full h-7 ${isSelected === 1 ? "bg-gray-900" : ""}`}>
                NEW ROOM
            </Link>

            <Link to={`/`}
                className={`border text-white text-xs flex items-center justify-center border-gray-900 w-full h-7 ${isSelected === 0 ? "bg-gray-900" : ""}`}>
                EXPLORE
            </Link>

            <Link to={`/chat/`}
                className={`border text-white text-xs flex items-center justify-center border-gray-900 w-full h-7 ${isSelected === 2 ? "bg-gray-900" : ""}`}>
                CHAT
            </Link>

        </section>
    )
}

export default Toolbar;