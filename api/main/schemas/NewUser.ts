import { z } from 'zod';

const NewUserSchema = z.object({
    name: z.string().min(3, {message: "Name is too short"}).max(55, {message: "Name is too long"})
    .regex(/^[a-zA-Z0-9\\-\\s_]{4,55}$/, {message: "Name doesn't follow the pattern"}),

    email: z.string().email().min(3, {message: "Email is too short"}).max(100, {message: "Email is too long"}),

    password: z.string().min(8, {message: "Password is too short"}).max(12, {message: "Password is too long"})
    .regex(/^(?=.*\d)(?=.*[a-z])[a-zA-Z\d]{8,12}$/, {message: "Password doesn't follow the pattern"}), 

    confirmPassword: z.string(),

}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export default NewUserSchema;