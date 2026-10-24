import * as z from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.url(),
});

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});
