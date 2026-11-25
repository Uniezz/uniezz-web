import { z } from 'zod';

export const groupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  members: z
    .array(z.string())
    .min(2)
    .refine((members) => new Set(members).size === members.length),
});

export type GroupSchema = z.infer<typeof groupSchema>;

const MB = 1024 * 1024;
export const MAX_CHAT_ATTACHMENTS = 5;

const chatImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const chatAttachmentAccept = chatImageTypes.join(',');

export const isChatImage = (file: { type: string }) => chatImageTypes.includes(file.type);

// The chat backend accepts images only, up to 10 MB each.
export const chatAttachmentSchema = z
  .instanceof(File)
  .refine(isChatImage)
  .refine((file) => file.size > 0 && file.size <= 10 * MB);
