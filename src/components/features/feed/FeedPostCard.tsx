import { Link, useLocation } from '@tanstack/react-router';
import { Images } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FeedPost } from '@/@types';
import { UIAvatar, UIPanel, UIUniversityLogo } from '@/ui/components';
import { cn } from '@/ui/cn';
import { authorName, isAuthorProfilePath, postDate } from '@/utils/feed';
import { useMyProfile } from '@/hooks';

export function FeedPostCard({ post }: { post: FeedPost }) {
  const { t, i18n } = useTranslation();
  const href = useLocation({ select: (location) => location.href });
  const { data: me } = useMyProfile();
  const image = post.mediaUrls?.[0];
  const isQuestion = post.type === 'question';
  return (
    <div className="group relative">
      <UIPanel surface="tint" className="overflow-hidden bg-ink/20 p-0 backdrop-blur-[48px]">
        {image && !isQuestion && (
          <div className="relative h-50 overflow-hidden rounded-t-card">
            <img
              src={image}
              alt=""
              className="size-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
            />
            {(post.mediaUrls?.length ?? 0) > 1 && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink-70 px-2.5 py-1 text-detail font-semibold text-white">
                <Images className="size-4" aria-hidden="true" />
                {post.mediaUrls?.length}
              </span>
            )}
          </div>
        )}
        <div className="min-w-0 p-5.5">
          <div
            className={cn(
              'mb-3 flex items-center gap-3',
              post.type !== 'announcement' && (!image || isQuestion) && 'pr-24',
            )}
          >
            <UIAvatar size="regular" imgSrc={post.author.avatarUrl ?? '/app/avatar.png'} alt="" />
            <div className="min-w-0">
              <p className="text-label font-medium text-white-80">
                {/* Already on the author's profile: a link would only reload this page. */}
                {isAuthorProfilePath(href, post.author.id, me?.id) ? (
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
              <p className="mt-1 flex items-center gap-1.5 text-detail text-secondary">
                <UIUniversityLogo universityId={post.author.universityId} size="xs" />
                {post.author.universityId.toUpperCase()} ·{' '}
                {postDate(post, i18n.resolvedLanguage ?? 'en')}
              </p>
            </div>
          </div>
          <h2 className="text-card-title font-semibold tracking-[-0.6px] wrap-anywhere">
            {post.title}
          </h2>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="app-hashtag wrap-anywhere">
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="app-hashtag text-secondary before:content-none">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </UIPanel>
      {post.type !== 'announcement' && (
        <span className="app-tag pointer-events-none absolute top-3 right-5.5 z-20 border-white-20 bg-surface px-2 py-1">
          {isQuestion ? t('app.question') : t('app.event')}
        </span>
      )}
      <Link
        to="/feed/post/$postId"
        params={{ postId: post.id }}
        search={{ postId: post.id, postFrom: href }}
        data-ph-capture-attribute-label="Open post"
        aria-label={`${t('app.viewPost')}: ${post.title}`}
        skullet-ignore=""
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-blue"
      />
    </div>
  );
}
