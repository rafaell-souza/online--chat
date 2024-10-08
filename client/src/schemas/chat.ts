import { z } from 'zod';

enum Language {
    Portuguese = 'Portuguese',
    English = 'English',
    Spanish = 'Spanish',
    French = 'French',
    German = 'German',
    Russian = 'Russian',
    Chinese = 'Chinese',
    Japanese = 'Japanese',
}


const chatSchema = z.object({
    name: z.string().min(3, {message: "Chat name must have at least 3 caracteres"}).max(55, {message: "Chat name must have at most 55 caracteres"}).regex(/^[a-zA-Z0-9\s_àéíôêáãúçóâõ\.\?\+!-]{3,55}$/, {message: "It accepts letters, number, spaces and (._+?!) "}),

    description: z.string().min(3, {message: "Chat description must have at least 3 caracteres"}).max(100, {message: "Chat description must have at most 100 caracteres"}).regex(/^[a-zA-Z0-9\s_àéíôêáãúçóâõ\.\?\+!-]+$/, {message: "It accpets letters, number, spaces and (._+?!) "}),

    capacity: z.string().regex(/^(?:[2-9]|[1-4][0-9]|50)$/),
    language: z.nativeEnum(Language),
});

export default chatSchema;