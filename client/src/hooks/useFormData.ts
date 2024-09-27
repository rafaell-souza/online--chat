import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

const useFormData = <T extends FieldValues>(
    schema: z.ZodType<T>,
    url: string
) => {
    const [loading, setLoading] = useState(false);
    const [statusCode, setStatusCode] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<T>({
        resolver: zodResolver(schema),
    });

    const handleSubmitForm = handleSubmit(async (data: T) => {
        setLoading(true);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                setStatusCode(response.status);
                setLoading(false);
            }

            else {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                setLoading(false);
            }
        }
        catch (err) {
            setLoading(false);
            console.error(err);
        }
    })

    return { loading, statusCode, register, errors, handleSubmitForm };
}

export default useFormData;