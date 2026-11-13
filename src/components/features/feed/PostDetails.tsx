import { CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FeedPost } from '@/@types';
import { cn } from '@/ui/cn';
import { postDate } from '@/utils';

export function PostDetails({ post, large = false }: { post: FeedPost; large?: boolean }) {
  const { i18n } = useTranslation();
  return (
    <>
      <h1
        className={cn(
          'font-semibold wrap-anywhere',
          large ? 'text-card-title tracking-[-0.6px]' : 'text-body tracking-[-0.2px]',
        )}
      >
        {post.title}
      </h1>
      {post.type === 'event' && (
        <p className="flex items-center gap-2 text-detail text-secondary">
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          {postDate(post, i18n.resolvedLanguage ?? 'en')}
        </p>
      )}
      {post.content && (
        <p
          className={cn(
            'text-body wrap-anywhere whitespace-pre-wrap text-white-80',
            // Only the body scrolls, so the title stays on top and the tags stay at the bottom.
            large &&
              'min-h-0 max-w-prose flex-1 [scrollbar-gutter:stable] overflow-y-auto leading-relaxed',
          )}
        >
          {post.content}
        </p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="app-hashtag wrap-anywhere">
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
