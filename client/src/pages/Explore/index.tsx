import Toolbar from "../../components/toolbar";
import { Link } from "react-router-dom";
import { MdLanguage } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import ExploreHelper from "./helper";

const Explore = () => {
    const { chats, userActiveChat, user } = ExploreHelper();
    return (
        <>
            <section className="flex h-screen w-full">
                <Toolbar isSelected={0} />

                <section className="w-full px-4 py-6 flex flex-col">

                    {
                        !userActiveChat && chats.length === 0 ? (
                            <section className="text-white font-bold h-full flex justify-center items-center">
                                <div className="flex-col w-72 text-center">
                                    <h1>There are no active chats available</h1>
                                    <Link
                                        to="/new-room"
                                        className="border border-gray-700 w-full bg-gray-900 hover:bg-gray-700 text-white h-6 rounded-lg py-4 justify-center cursor-pointer items-center flex mt-4"
                                    >
                                        Create chat
                                    </Link>
                                </div>
                            </section>
                        ) : (
                            <>
                                {
                                    userActiveChat && (
                                        <section className="w-full mt-6">
                                            <h1 className="text-white">PARTICIPATING</h1>
                                            <div className="mt-1 flex flex-col">
                                                {
                                                    userActiveChat && (
                                                        <div className="border flex bg-gray-900 rounded border-gray-700 p-1 gap-x-1 items-center">
                                                            <div className="h-full w-full px-2 flex flex-col">
                                                                <h1 className="text-white mb-1">{userActiveChat.name}</h1>
                                                                <p className="text-gray-400 w-96 break-words leading-none pr-3 text-sm">{userActiveChat.description}</p>
                                                            </div>

                                                            <div className="w-full h-full flex flex-col">

                                                                <Link
                                                                    to={`/chat/${userActiveChat.id}`}
                                                                    className={`border border-gray-700 w-full bg-gray-700 hover:bg-gray-600 text-white h-6 rounded-lg py-4 justify-center cursor-pointer items-center flex pointer-events-none opacity-50`}
                                                                >
                                                                    Participating
                                                                </Link>

                                                                <div className="flex mt-2 gap-x-1">
                                                                    <p className="text-gray-300 bg-blue-900 px-4 rounded bg-opacity-30 text-xs w-full">{userActiveChat.host}</p>

                                                                    <p className="text-gray-300 bg-violet-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 items-center justify-center w-full">
                                                                        <MdLanguage className="text-lg" />
                                                                        {userActiveChat.language}
                                                                    </p>

                                                                    <p className="text-gray-300 bg-yellow-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 justify-center items-center w-full">
                                                                        <FaPeopleGroup className="text-lg" />
                                                                        {`${userActiveChat.activeUsers}/${userActiveChat.capacity}`}
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
                                        <section className="w-full mt-4 h-full">
                                            {
                                                chats.filter(chat => !chat.blackList.includes(user.id))
                                                    .length > 0 ? (
                                                    <>
                                                        <h1 className="text-white">ACTIVE CHATS</h1>
                                                        <div className="mt-1 flex flex-col h-44 gap-y-2 overflow-y-auto">
                                                            {
                                                                chats.filter(chat => !chat.blackList.includes(user.id)).map((chat) => (
                                                                    <div key={chat.id} className="border flex bg-gray-900 rounded border-gray-700 p-1 gap-x-1 ">
                                                                        <div className="h-full w-full px-2 flex flex-col">
                                                                            <h1 className="text-white mb-1">{chat.name}</h1>
                                                                            <p className="text-gray-400 w-96 break-words leading-none pr-3 text-sm">{chat.description}</p>
                                                                        </div>

                                                                        <div className="w-full h-full flex flex-col">

                                                                            <Link
                                                                                to={`/chat/${chat.id}`}
                                                                                className={`border border-gray-700 w-full bg-gray-700 hover:bg-gray-600 text-white h-6 rounded-lg py-4 justify-center cursor-pointer items-center flex ${chat.activeUsers === chat.capacity ? "pointer-events-none opacity-50" : ""}`}
                                                                            >
                                                                                {`${chat.activeUsers === chat.capacity ? "Chat is full" : "Join chat"}`}
                                                                            </Link>

                                                                            <div className="flex mt-2 gap-x-1">
                                                                                <p className="text-gray-300 bg-blue-900 px-4 rounded bg-opacity-30 text-xs w-full words-break flex justify-center items-center">{chat.host}</p>

                                                                                <p className="text-gray-300 bg-violet-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 items-center justify-center w-full">
                                                                                    <MdLanguage className="text-lg" />
                                                                                    {chat.language}
                                                                                </p>

                                                                                <p className="text-gray-300 bg-yellow-900 px-3 rounded bg-opacity-30 text-xs flex gap-x-1 justify-center items-center w-full">
                                                                                    <FaPeopleGroup className="text-lg" />
                                                                                    {`${chat.activeUsers}/${chat.capacity}`}
                                                                                </p>
                                                                            </div>
                                                                        </div>-
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </>
                                                ) : (
                                                    <section className="text-white font-bold h-full flex justify-center items-center">
                                                        <div className="flex-col w-72 text-center">
                                                            <h1>There are no active chats available</h1>
                                                            <Link
                                                                to="/new-room"
                                                                className="border border-gray-700 w-full bg-gray-700 hover:bg-gray-600 text-white h-6 rounded-lg py-4 justify-center cursor-pointer items-center flex mt-4"
                                                            >
                                                                Create chat
                                                            </Link>
                                                        </div>
                                                    </section>
                                                )
                                            }
                                        </section>
                                    )
                                }
                            </>
                        )
                    }

                </section>
            </section>
        </>
    )
}

export default Explore;