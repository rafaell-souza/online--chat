import { z } from 'zod';

enum Language {
    Portuguese = 'Portuguese',
    English = 'English',
    Spanish = 'Spanish',
    French = 'French',
    Italian = 'Italian',
    German = 'German',
    Russian = 'Russian',
    Chinese = 'Chinese',
    Japanese = 'Japanese',
    Korean = 'Korean',
    Arabic = 'Arabic',
}


const chatSchema = z.object({
    name: z.string().regex(/^[a-zA-Z0-9_\-. ]{3,55}$/),
    description: z.string().min(3).max(255).regex(/^[a-zA-Z0-9_\-. ]+$/),
    capacity: z.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/),
    language: z.nativeEnum(Language),
});

export default chatSchema;