import { Link, useLocation } from '@tanstack/react-router';
import { Images } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FeedPostCardProps } from '@/@types';
import { UIAvatar, UIPanel, UITags, UIUniversityLogo } from '@/ui/components';
import { cn } from '@/ui/cn';
import { AuthorRow } from './AuthorRow';
import { authorName, isAuthorProfilePath, postDate } from '@/utils';
import { useMyProfile } from '@/hooks';

export function FeedPostCard({ post, filters, source = 'posts' }: FeedPostCardProps) {
  const { t, i18n } = useTranslation();
  const href = useLocation({ select: (location) => location.href });
  const { data: me } = useMyProfile();
  const image = post.mediaUrls?.[0];
  const isQuestion = post.type === 'question';
  const locale = i18n.resolvedLanguage ?? 'en';
  const isOnAuthorProfile = isAuthorProfilePath(href, post.author.id, me?.id);
  return (
    <div className="group relative max-lg:active:opacity-80">
      <UIPanel
        surface="tint"
        className={cn(
          'transform-gpu overflow-hidden bg-ink/20 p-0 backdrop-blur-[48px]',
          // On a phone, the mobile app's card: author and title first, the cover inset at the bottom.
          'max-lg:flex max-lg:transform-none max-lg:flex-col max-lg:gap-4 max-lg:border-white/14 max-lg:bg-white/3 max-lg:bg-linear-to-b max-lg:from-white-5 max-lg:to-white-0 max-lg:to-70% max-lg:px-1.5 max-lg:pt-4 max-lg:backdrop-blur-none',
          image ? 'max-lg:pb-1.5' : 'max-lg:pb-4',
        )}
      >
        {image && (
          <div className="relative h-50 overflow-hidden rounded-t-card max-lg:order-last max-lg:h-52 max-lg:rounded-xl">
            <img
              src={image}
              alt=""
              className="size-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
            />
            {(post.mediaUrls?.length ?? 0) > 1 && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink-70 px-2.5 py-1 text-detail font-semibold text-white max-lg:hidden">
                <Images className="size-4" aria-hidden="true" />
                {post.mediaUrls?.length}
              </span>
            )}
            {/* On a phone, the mobile app's event date pill on the cover. */}
            {post.eventDate && (
              <span className="absolute top-2.5 left-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-full border border-white-20 bg-ink-40 px-2.25 py-1 text-micro font-semibold lg:hidden">
                {postDate(post, locale)}
              </span>
            )}
          </div>
        )}
        <div className="min-w-0 p-5.5 max-lg:px-2.5 max-lg:py-0">
          {/* On a phone, the mobile app's author row: always the creation date; the event date sits on the cover. */}
          <AuthorRow
            author={post.author}
            meta={postDate({ eventDate: null, createdAt: post.createdAt }, locale)}
            disabled={isOnAuthorProfile}
            className="mb-4 lg:hidden"
          />
          <div
            className={cn(
              'mb-3 flex items-center gap-3 max-lg:mb-4 max-lg:hidden max-lg:gap-2',
              post.type !== 'announcement' && !image && 'lg:pr-24',
            )}
          >
            <UIAvatar
              size="regular"
              imgSrc={post.author.avatarUrl ?? '/app/avatar.png'}
              alt=""
              className="max-lg:[&>div]:size-8"
            />
            {/* On a phone, name, university logo and date share one line; the name truncates first. */}
            <div className="min-w-0 max-lg:flex max-lg:items-center max-lg:gap-2">
              <p className="text-label font-medium text-white-80 max-lg:truncate max-lg:text-detail max-lg:text-white">
                {/* Already on the author's profile: a link would only reload this page. */}
                {isOnAuthorProfile ? (
                  authorName(post.author) || t('apiState.student')
                ) : (
                  <Link
                    to="/connections/students/$profileId"
                    data-ph-capture-attribute-label="Open post author profile"
                    params={{ profileId: post.author.id }}
                    search={{ studentSearch: undefined, from: href }}
                    className="relative z-20 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-blue"
                  >
                    {authorName(post.author) || t('apiState.student')}
                  </Link>
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-detail text-secondary max-lg:mt-0 max-lg:shrink-0 max-lg:gap-2">
                <UIUniversityLogo universityId={post.author.universityId} size="xs" />
                <span>
                  <span className="max-lg:hidden">{post.author.universityId.toUpperCase()} </span>·{' '}
                  {postDate(post, locale)}
                </span>
              </p>
            </div>
          </div>
          <h2 className="text-card-title font-semibold tracking-[-0.6px] wrap-anywhere max-lg:text-[19px] max-lg:leading-[1.35] max-lg:tracking-[-0.2px]">
            {post.title}
          </h2>
          {!image && post.content && (
            <p className="mt-2.5 line-clamp-4 text-body wrap-anywhere text-secondary lg:hidden">
              {post.content}
            </p>
          )}
          <UITags
            tags={post.tags}
            variant="hashtag"
            max={1}
            className="mt-3 gap-1.5 max-lg:hidden"
          />
        </div>
      </UIPanel>
      {post.type !== 'announcement' && (
        <span className="app-tag pointer-events-none absolute top-3 right-5.5 z-20 border-white-20 bg-surface px-2 py-1 max-lg:hidden">
          {isQuestion ? t('app.question') : t('app.event')}
        </span>
      )}
      <Link
        to="/feed/post/$postId"
        params={{ postId: post.id }}
        search={{ postFrom: href, postFilters: filters, postSource: source }}
        data-ph-capture-attribute-label="Open post"
        aria-label={`${t('app.viewPost')}: ${post.title}`}
        skullet-ignore=""
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-blue"
      />
    </div>
  );
}
