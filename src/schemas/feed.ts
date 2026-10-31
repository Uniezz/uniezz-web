import { z } from 'zod';
import { messageSchema } from './message';

export const textFormSchema = z.object({ text: messageSchema });

export type TextFormSchema = z.infer<typeof textFormSchema>;

export const postSchema = z
  .object({
    type: z.enum(['announcement', 'question', 'event']),
    title: z.string().trim().min(3).max(150),
    body: z.string().trim().min(10).max(5000),
    date: z.string(),
    time: z.string(),
    image: z
      .file()
      .min(1)
      .max(10 * 1024 * 1024)
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
  });

export type PostSchema = z.infer<typeof postSchema>;
