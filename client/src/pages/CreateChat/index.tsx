import Toolbar from "../../components/toolbar";
import { MdError } from "react-icons/md";
import CreateChatHelper from "./helper";

const CreateChat = () => {
    const { handleSubmitForm, register, errors } = CreateChatHelper();
    return (
        <>
            <section className="flex h-screen w-full">
                <Toolbar isSelected={1} />

                <section className="w-full text-gray-300 flex flex-col relative justify-start">

                <h1 className="text-3xl mx-4 mt-6">Create chat</h1>

                    <form
                        onSubmit={handleSubmitForm}
                        className="flex mt-4 flex-col mx-4 py-2">

                        <div className="flex gap-x-8">

                            <div className="flex flex-col w-80">
                                <label>Room name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 px-1 h-8 rounded outline-none"
                                    {...register("name")}
                                />
                                {
                                    errors.name && (
                                        <div className="flex items-center gap-x-1 text-xs text-red-500">
                                            <MdError />
                                            <span>{errors.name.message}</span>
                                        </div>
                                    )
                                }

                                <label className="mt-1">Room description</label>
                                <textarea
                                    className="w-full bg-gray-900 py-1 px-2 scrollbar leading-none h-20 rounded outline-none"
                                    {...register("description")}
                                ></textarea>
                                {
                                    errors.description && (
                                        <div className="flex items-center gap-x-1 text-xs text-red-500">
                                            <MdError />
                                            <span>{errors.description.message}</span>
                                        </div>
                                    )
                                }

                                <div className="flex gap-x-1 items-center mt-2">
                                    <label htmlFor="Participants">Participants</label>
                                    <input
                                        type="number" min="2" max="50" defaultValue="2"
                                        className="w-11 bg-gray-900 px-1 h-6 rounded outline-none"
                                        {...register("capacity")}
                                    />
                                </div>
                            </div>

                            <div className="gap-x-2 flex">
                                <label htmlFor="language">Chat language:</label>
                                <select
                                    className="bg-gray-900 px-1 h-8 rounded outline-none"
                                    {...register("language")}
                                >
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                    <option value="Portuguese">Portuguese</option>
                                    <option value="Russian">Russian</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="Japanese">Japanese</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-gray-900 hover:bg-gray-700 h-8 rounded w-40  mt-4"
                        >
                            Create room
                        </button>

                    </form>

                </section>

            </section>
        </>
    )
}

export default CreateChat;