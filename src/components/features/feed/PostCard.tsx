import { CalendarDays, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FeedPost } from '@/@types';
import { postDate } from '@/utils';
import { AuthorRow } from './AuthorRow';
import { FeedLikeButton } from './FeedLikeButton';
import { FeedSaveButton } from './FeedSaveButton';
import { PostMediaPager } from './PostMediaPager';
import { PostTag } from './PostTag';

/** The mobile app's full post card: author, text, media, tags and a stats row with the audience. */
export function PostCard({
  post,
  isAuthorDisabled,
}: {
  post: FeedPost;
  /** Opened from the author's profile: Back already returns there. */
  isAuthorDisabled: boolean;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'en';
  const images = post.mediaUrls ?? [];

  return (
    <article className="flex flex-col gap-4 overflow-hidden rounded-card border border-white/14 bg-white/3 bg-linear-to-b from-white-5 to-white-0 to-65% px-1.5 py-2.5">
      <AuthorRow
        author={post.author}
        meta={postDate({ eventDate: null, createdAt: post.createdAt }, locale)}
        disabled={isAuthorDisabled}
        className="px-1"
      />
      <div className="flex flex-col gap-2 px-1">
        <h1 className="text-[26px] leading-[32.5px] font-semibold tracking-[-0.6px] wrap-anywhere">
          {post.title}
        </h1>
        {post.type === 'event' && post.eventDate && (
          <p className="flex items-center gap-1.25 text-detail text-secondary">
            <CalendarDays size={14} className="shrink-0 text-white-60" aria-hidden="true" />
            {postDate(post, locale)}
          </p>
        )}
        {post.content && (
          <p className="text-base leading-[1.55] wrap-anywhere whitespace-pre-wrap text-white-80">
            {post.content}
          </p>
        )}
      </div>
      {images.length > 0 && <PostMediaPager images={images} />}
      {(post.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {post.tags?.map((tag) => (
            <PostTag key={tag} tag={tag} />
          ))}
        </div>
      )}
      <div className="mx-1 flex items-center gap-3.5 border-t border-white/8 pt-3">
        <FeedLikeButton id={post.id} kind="post" liked={post.likedByMe} count={post.likesCount} />
        <FeedSaveButton id={post.id} saved={post.savedByMe} />
        <span className="flex min-w-0 flex-1 items-center gap-1.25 text-detail text-white-80">
          <Users size={14} className="shrink-0 text-white-40" aria-hidden="true" />
          <span className="truncate">
            {post.university === 'all' ? t('feed.allStudents') : post.university.toUpperCase()}
          </span>
        </span>
      </div>
    </article>
  );
}
