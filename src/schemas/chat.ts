import { z } from 'zod';

export const groupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  members: z
    .array(z.string())
    .min(2)
    .refine((members) => new Set(members).size === members.length),
});

export type GroupSchema = z.infer<typeof groupSchema>;

export const chatAttachmentSchema = z
  .instanceof(File)
  .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
  .refine((file) => file.size > 0 && file.size <= 10 * 1024 * 1024);

export const MAX_CHAT_IMAGES = 5;
