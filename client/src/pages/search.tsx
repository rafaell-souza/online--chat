import Toolbar from "../components/toolbar";
import { useForm } from "react-hook-form";
import searchSchema from "../schemas/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { MdLanguage } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { userData } from "../context/userData";

type Chat = {
    id: string;
    name: string;
    description: string;
    capacity: number;
    status: string;
    language: string;
    host: string;
    activeUsers: number;
}

const Search = () => {
    const [searchedData, setSearchedData] = useState<Chat[]>([]);

    const { user } = useContext(userData);

    const {
        register,
        handleSubmit,
        resetField,
    } = useForm({
        resolver: zodResolver(searchSchema),
    });

    const handleSubmitForm = handleSubmit((data) => {
        const url = `http://localhost:9000/api/chat/search/${user.id}?query=${data.query}&by=${data.by}`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => response.json())
            .then((data) => {
                if (searchedData.length > 0) {
                    setSearchedData([]);
                    setSearchedData(data.chat);
                }
                else setSearchedData(data.chat);
            });
        resetField("query")
    })

    return (
        <section className="flex h-screen w-full">
            <Toolbar isSelected={3} />

            <div className="w-full px-4 py-8 flex flex-col">
                <form className="flex gap-x-1"
                    onSubmit={handleSubmitForm}
                >
                    <input
                        type="text"
                        className="w-80 border border-gray-800 outline-none rounded bg-gray-900 text-white px-2 h-7"
                        {...register("query")}
                    />

                    <select
                        className="rounded  bg-gray-800 text-white outline-none"
                        {...register("by")}
                    >
                        <option value="name">By name</option>
                        <option value="host">By host</option>
                    </select>

                    <button type="submit" className="border border-gray-700 bg-gray-800 px-6 rounded text-white hover:bg-gray-700">Search</button>
                </form>

                <div className="w-full mt-6 h-80 overflow-y-auto">
                    {
                        searchedData.length === 0 ? (
                            <h1 className="text-white h-60 flex justify-center text-xl items-center">No chats found</h1>
                        ) : (
                            searchedData.map((chat) => (
                                <div key={chat.id} className="border flex bg-gray-900 rounded border-gray-700 p-1 gap-x-1">
                                    <div className="h-full w-full flex flex-col">
                                        <h1 className="text-white">{chat.name}</h1>
                                        <p className="text-gray-400">{chat.description}</p>
                                    </div>

                                    <div className="w-full h-full flex flex-col">

                                        <Link
                                            to={`/chat/${chat.id}`}
                                            className={`border border-gray-700 w-full bg-gray-700 hover:bg-gray-600 text-white h-6 rounded-lg py-4 justify-center cursor-pointer items-center flex`}
                                        >
                                            Join chat
                                        </Link>

                                        <div className="flex mt-2 gap-x-1">
                                            <p className="text-gray-300 bg-blue-900 px-4 rounded bg-opacity-30 text-xs w-full">{chat.host}</p>

                                            <p className="text-gray-300 bg-violet-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 items-center justify-center w-full">
                                                <MdLanguage className="text-lg" />
                                                {chat.language}
                                            </p>

                                            <p className="text-gray-300 bg-yellow-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 justify-center items-center w-full">
                                                <FaPeopleGroup className="text-lg" />
                                                {chat.activeUsers}/{chat.capacity}
                                            </p>
                                        </div>
                                    </div>-
                                </div>
                            ))
                        )
                    }
                </div>

            </div>


        </section>
    )
}

export default Search