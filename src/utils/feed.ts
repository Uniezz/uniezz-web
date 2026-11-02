import type { FeedPost } from '@/@types';
import type { components } from '@/@types/schema';
import type { PostSchema } from '@/schemas';

export type UploadedPostImage = { file: File; mediaId: string };

export async function uploadPostImages(
  files: File[],
  previous: UploadedPostImage[],
  upload: (file: File) => Promise<UploadedPostImage>,
) {
  const uploaded = previous.filter((item) => files.includes(item.file));
  const mediaIds: string[] = [];
  try {
    for (const file of files) {
      let image = uploaded.find((item) => item.file === file);
      if (!image) {
        image = await upload(file);
        uploaded.push(image);
      }
      mediaIds.push(image.mediaId);
    }
    return { uploaded, mediaIds, failed: false as const };
  } catch (error) {
    return { uploaded, failed: true as const, error };
  }
}

export function postFormDefaults(
  post: Pick<FeedPost, 'eventDate' | 'type' | 'university' | 'title' | 'content' | 'tags'>,
): PostSchema {
  const date = post.eventDate ? new Date(post.eventDate) : null;
  const local =
    date && !Number.isNaN(date.getTime())
      ? new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
      : '';
  const [day = '', time = ''] = local.split('T');
  return {
    type: post.type,
    audience: post.university === 'all' ? 'all' : 'university',
    title: post.title,
    body: post.content,
    tags: post.tags ?? [],
    tagDraft: '',
    images: [],
    date: day,
    time,
  };
}

export function authorName(
  author?: Pick<components['schemas']['Author'], 'firstName' | 'lastName'>,
) {
  return [author?.firstName, author?.lastName].filter(Boolean).join(' ');
}

export function postDate(post: Pick<FeedPost, 'eventDate' | 'createdAt'>, locale: string) {
  const date = new Date(post.eventDate ?? post.createdAt);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
}

export function postSubmission(
  body: components['schemas']['CreatePostInputBody'],
  previous?: { body: components['schemas']['CreatePostInputBody']; key: string },
) {
  return previous && JSON.stringify(previous.body) === JSON.stringify(body)
    ? previous
    : { body, key: crypto.randomUUID() };
}
