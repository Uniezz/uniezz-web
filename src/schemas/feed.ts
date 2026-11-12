import { z } from 'zod';
import { messageSchema } from './message';

export const textFormSchema = z.object({ text: messageSchema });

export type TextFormSchema = z.infer<typeof textFormSchema>;

export const commentSchema = z.string().trim().min(1).max(1000);

export const postTagsSchema = z.array(z.string().trim().min(1).max(30)).max(10);
export const postTagAdditionSchema = postTagsSchema.refine((tags) => {
  const added = tags.at(-1)?.toLocaleLowerCase();
  return !tags.slice(0, -1).some((tag) => tag.toLocaleLowerCase() === added);
});
export const postTagDraftSchema = z.string().max(319);
export const parsePostTagDraft = (draft: string) =>
  draft
    .trim()
    .split(/\s+/)
    .map((tag) => tag.replace(/^#+/, ''))
    .filter(Boolean);

export const postImagesSchema = z
  .array(
    z
      .file()
      .min(1)
      .max(10 * 1024 * 1024)
      .mime(['image/jpeg', 'image/png', 'image/webp']),
  )
  .max(10);

export const postSchema = z
  .object({
    type: z.enum(['announcement', 'question', 'event']),
    audience: z.enum(['university', 'all']),
    title: z.string().trim().min(3).max(150),
    body: z.string().trim().min(10).max(5000),
    date: z.string(),
    time: z.string(),
    images: postImagesSchema,
    tags: postTagsSchema,
    tagDraft: postTagDraftSchema,
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

export const feedPostSearchSchema = z.object({
  postFilters: z
    .object({
      q: z.string().max(500).optional(),
      authorId: z.string().max(120).optional(),
      university: z.string().max(40).optional(),
      type: z.enum(['announcement', 'event', 'question']).optional(),
      from: z.iso.datetime().optional(),
      to: z.iso.datetime().optional(),
      limit: z.number().int().min(1).max(50).optional(),
    })
    .optional()
    .catch(undefined),
  postSource: z.enum(['posts', 'liked', 'saved']).optional().catch(undefined),
});
