import { z } from 'zod';

export const groupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  members: z
    .array(z.string())
    .min(2)
    .refine((members) => new Set(members).size === members.length),
});

export type GroupSchema = z.infer<typeof groupSchema>;
