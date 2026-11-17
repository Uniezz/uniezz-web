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
// TODO(api): The backend accepts only images for the chat upload kind; files stay local until it allows these types.
const chatFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/markdown',
  'application/zip',
  'application/x-zip-compressed',
];

export const chatAttachmentAccept = [...chatImageTypes, ...chatFileTypes, '.md'].join(',');

export const isChatImage = (file: { type: string }) => chatImageTypes.includes(file.type);

// Some browsers send no type for Markdown files, so the extension decides.
const isChatFile = (file: File) =>
  chatFileTypes.includes(file.type) ||
  (file.type === '' && file.name.toLowerCase().endsWith('.md'));

export const chatAttachmentSchema = z
  .instanceof(File)
  .refine((file) => isChatImage(file) || isChatFile(file))
  .refine((file) => file.size > 0 && file.size <= (isChatImage(file) ? 10 : 20) * MB);
