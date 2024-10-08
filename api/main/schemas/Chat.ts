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
    name: z.string().regex(/^[a-zA-Z0-9 _àéíôêáãúçóâõ\.\?\+!-]{3,55}$/),
    description: z.string().min(3).max(100).regex(/^[a-zA-Z0-9 _àéíôêáãúçóâõ\.\?\+!-]+$/),
    capacity: z.string().regex(/^(?:[2-9]|[1-4][0-9]|50)$/),
    language: z.nativeEnum(Language),
});

export default chatSchema;