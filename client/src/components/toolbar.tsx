import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Toolbar = ({ isSelected }: {isSelected: number}) => {
    return (
        <section className="border-r border-zinc-900 pt-4 px-2 flex flex-col gap-y-1 bg-black bg-opacity-10 w-48 h-screen">

            <div className="flex items-center mt-4 flex-col">
                <FaUserCircle className="text-4xl text-white" />
                <p className="text-gray-500 text-sm mt-1 text-center">John Doe</p>
            </div>

            <Link to="/new-room"
            className={`border mt-5 text-white text-xs flex items-center justify-center border-gray-900 w-full h-7 ${isSelected === 1 ? "bg-gray-900": ""}`}>
                NEW ROOM
            </Link>

            <Link to={`/`}
            className={`border text-white text-xs flex items-center justify-center border-gray-900 w-full h-7 ${isSelected === 0 ? "bg-gray-900": ""}`}>
                EXPLORE
            </Link>

        </section>
    )
}

export default Toolbar;