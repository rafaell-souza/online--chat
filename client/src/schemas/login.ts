import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email().min(3, { message: "Email or password is incorrect" }).max(100, { message: "Email or password is incorrect" }),

    password: z.string().min(8, { message: "Email or password is incorrect" }).max(12, { message: "Email or password is incorrect" }).regex(/^(?=.*\d)(?=.*[a-z])[a-zA-Z\d]{8,12}$/, { message: "Email or password is incorrect" }),
});

export default loginSchema;