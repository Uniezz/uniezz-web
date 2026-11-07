import * as z from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_POSTHOG_PROJECT_TOKEN: z.string().startsWith('phc_'),
  VITE_POSTHOG_HOST: z.url(),
});

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_POSTHOG_PROJECT_TOKEN: import.meta.env.VITE_POSTHOG_PROJECT_TOKEN,
  VITE_POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,
});
