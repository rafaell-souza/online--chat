import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(3, {message: "Name is too short"}).max(55, {message: "Name is too long"})
    .regex(/^[a-zA-Z0-9 _àéíôêáãúçóâõ\.-]{4,55}$/, {message: "Name can contain leterrs, numbers, spaces and (_.-)"}),

    email: z.string().email().min(3, {message: "Email is too short"}).max(100, {message: "Email is too long"}),

    password: z.string().min(8, {message: "Password is 8-12 characteres"}).max(12, {message: "Password is 8-12 characteres"})
    .regex(/^(?=.*\d)(?=.*[a-z])[a-z\d]{8,12}$/, {message: "Password must contain letters and numbers"}), 

    confirmPassword: z.string().min(8, {message: "Password is 8-12 characteres"}).max(12, {message: "Password is 8-12 characteres"})

}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export default registerSchema;