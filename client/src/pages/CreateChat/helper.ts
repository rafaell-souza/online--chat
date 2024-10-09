import { useForm } from "react-hook-form"
import chatSchema from "../../schemas/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

type ChatData = {
    name: string;
    description: string;
    capacity: number;
    language: string;
}

const CreateChatHelper = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ChatData>({
        resolver: zodResolver(chatSchema)
    });
    const navigate = useNavigate()

    const handleSubmitForm = handleSubmit(async (data) => {
        const response = await fetch("http://localhost:9000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        })

        const newChat = await response.json() as { chatid: string, newToken: string };
        localStorage.setItem("token", newChat.newToken)
        navigate(`/chat/${newChat.chatid}`)
    })

    return {
        register,
        handleSubmitForm,
        errors
    }
}

export default CreateChatHelper;