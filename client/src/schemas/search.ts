import { z } from 'zod';

const searchSchema = z.object({
    query: z.string().nonempty().regex(/^[a-zA-Z0-9_\-. ]{3,55}$/),
    by: z.enum(["name", "host"]),
});

export default searchSchema;