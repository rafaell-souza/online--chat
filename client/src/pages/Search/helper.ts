import { useForm } from "react-hook-form";
import searchSchema from "../../schemas/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useContext } from "react";
import { userData } from "../../context/userData";

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

const SearchHelper = () => {
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

    return {
        register,
        handleSubmitForm,
        searchedData
    }
}

export default SearchHelper;