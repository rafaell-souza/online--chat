import { z } from "zod";

const LoginUserSchema = z.object({
    email: z.string().email().min(3, { message: "Email is too short" }).max(100, { message: "Email is too long" }),

    password: z.string().min(8, { message: "Password is too short" }).max(12, { message: "Password is too long" })
        .regex(/^(?=.*\d)(?=.*[a-z])[a-zA-Z\d]{8,12}$/, { message: "Password doesn't follow the pattern" }),
})

export default LoginUserSchema;