import Toolbar from "../../components/toolbar";
import { FaUserCircle } from "react-icons/fa";
import ChatHelper from "./helper";

const Chat = () => {

    const {
        messages,
        usersinChat,
        blackList,
        inputValue,
        isHost,
        userWasKicked,
        user,
        handleSendMessage,
        setInputValue,
        handleKickOut,
        RemoveFromBlackList,
        lastMessage,
        navigate
    } = ChatHelper();

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
                                    <div className="bg-gray-800 text-white text-sm rounded px-2 py-1 mt-2">Black list</div>
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