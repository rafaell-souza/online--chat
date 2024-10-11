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
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setUser(data);
        }
        fetchUser();
    }, []);

    const chatid = sessionStorage.getItem("chatid");

    const handleLogout = async () => {
        await fetch("http://localhost:9000/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        sessionStorage.removeItem("token");
    };

    return (
        <section className="border-r border-zinc-950 pt-4 px-2 flex flex-col gap-y-1 bg-black bg-opacity-20 w-48 h-screen relative">

            <div className="flex items-center mt-4 flex-col">
                <FaUserCircle className="text-4xl text-white" />
                <p className="text-gray-500 text-sm mt-1 text-center">{user.name}</p>
            </div>

            <Link to={`/`}
                className={`mt-6 text-white border border-gray-900 rounded-lg text-xs flex items-center justify-center w-full h-7 ${isSelected === 0 ? "bg-gray-700" : "hover:bg-gray-900 bg-gray-950"}`}>
                EXPLORE
            </Link>

            <Link to="/new-room"
                className={`text-white border border-gray-900 text-xs flex rounded-lg items-center justify-center w-full h-7 ${isSelected === 1 ? "bg-gray-700" : "hover:bg-gray-900 bg-gray-950"}`}>
                NEW ROOM
            </Link>

            <Link to={`${chatid ? `/chat/${chatid}` : "/"}`}
                className={`text-white border border-gray-900 rounded-lg text-xs flex items-center justify-center w-full h-7 ${isSelected === 2 ? "bg-gray-700" : "hover:bg-gray-900 bg-gray-950"} ${chatid ? "" : "pointer-events-none opacity-40"}`}>
                CHAT
            </Link>

            <Link to="/search"
                className={`text-white border border-gray-900 rounded-lg text-xs flex items-center justify-center w-full h-7 ${isSelected === 3 ? "bg-gray-700" : "hover:bg-gray-900 bg-gray-950"}`}>
                SEARCH
            </Link>

            <Link 
            to="/login"
            onClick={handleLogout}
                className="text-white rounded-lg text-xs flex items-center justify-center w-full h-7 bg-gray-950 border border-gray-900 hover:bg-gray-900 mt-28">
                LOGOUT
            </Link>

        </section>
    )
}

export default Toolbar;