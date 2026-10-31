import type { FeedPost } from '@/@types';
import type { components } from '@/@types/schema';

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
