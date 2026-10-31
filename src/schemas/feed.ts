import { z } from 'zod';
import { messageSchema } from './message';

export const textFormSchema = z.object({ text: messageSchema });

export type TextFormSchema = z.infer<typeof textFormSchema>;

export const postSchema = z
  .object({
    type: z.enum(['post', 'question', 'event']),
    title: z.string().trim().min(1).max(160),
    body: z.string().trim().max(4000),
    date: z.string(),
    time: z.string(),
    location: z.string().trim().max(160),
    image: z
      .file()
      .max(5 * 1024 * 1024)
      .mime(['image/jpeg', 'image/png', 'image/webp'])
      .optional(),
  })
  .superRefine((post, context) => {
    if (post.type !== 'event') return;
    if (!z.iso.date().safeParse(post.date).success) {
      context.addIssue({ code: 'custom', path: ['date'], message: 'Required' });
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(post.time)) {
      context.addIssue({ code: 'custom', path: ['time'], message: 'Required' });
    }
    if (!post.location) {
      context.addIssue({ code: 'custom', path: ['location'], message: 'Required' });
    }
  });

export type PostSchema = z.infer<typeof postSchema>;
