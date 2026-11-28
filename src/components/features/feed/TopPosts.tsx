import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFeaturedFeedPosts } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIQueryError } from '@/ui/components';
import { eventTime, isLiveEvent, postDate } from '@/utils';

export function TopPosts() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch } = useFeaturedFeedPosts();
  const items = data?.items ?? [];
  const locale = i18n.resolvedLanguage ?? 'en';
  // On a phone, as the mobile app: no loading or error state, the row keeps its "New post" tile.
  const status = isPending ? (
    <p role="status" className="max-lg:hidden">
      {t('apiState.loading')}
    </p>
  ) : isError ? (
    <div className="max-lg:hidden">
      <UIQueryError retry={refetch} />
    </div>
  ) : null;

  return (
    <>
      {status}
      {/* On a phone, the mobile app's story row: it bleeds to the screen edges, fades there and starts with a "New post" tile. */}
      <div
        className={cn(
          'mb-6 flex gap-3 overflow-x-auto max-lg:-mx-4 max-lg:mb-5 max-lg:[scrollbar-width:none] max-lg:gap-2 max-lg:[mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] max-lg:px-4 sm:max-lg:-mx-7 sm:max-lg:px-7',
          (status || items.length === 0) && 'lg:hidden',
        )}
      >
        <Link
          to="/feed/post/new-post"
          search={{ postFrom: undefined }}
          data-ph-capture-attribute-label={t('app.newPost')}
          className="flex h-28 w-21 shrink-0 flex-col items-center justify-center gap-2 rounded-programme border border-white/12 bg-white/3 px-1.5 text-center text-micro font-semibold break-words focus-visible:outline-2 focus-visible:outline-blue lg:hidden"
        >
          <span className="grid size-8.5 place-items-center rounded-full bg-white text-ink">
            <Plus size={18} aria-hidden="true" />
          </span>
          {t('app.newPost')}
        </Link>
        {!status &&
          items.map((post) => {
            const isLive = isLiveEvent(post.eventDate);
            return (
              <Link
                key={post.id}
                to="/feed/post/$postId"
                params={{ postId: post.id }}
                data-ph-capture-attribute-label="Open featured post"
                className="group relative h-47 min-w-36 flex-1 overflow-hidden rounded-story bg-surface text-left focus-visible:outline-2 focus-visible:outline-blue max-lg:h-28 max-lg:w-21 max-lg:min-w-21 max-lg:flex-none max-lg:rounded-programme max-lg:bg-surface-60"
              >
                <img
                  src={post.imageUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <span className="absolute inset-0 bg-linear-to-t from-ink-90 via-ink-0 to-ink-0 max-lg:bg-[linear-gradient(to_bottom,var(--color-ink-0)_35%,var(--color-ink-90))]" />
                {post.eventDate && (
                  <span
                    className={cn(
                      'absolute top-2.5 left-2.5 rounded-full border border-white-20 bg-ink-40 px-2.25 py-1 text-micro font-bold backdrop-blur-[12px] max-lg:top-2 max-lg:left-2 max-lg:max-w-[calc(100%-1rem)] max-lg:truncate max-lg:px-1.75 max-lg:py-0.75 max-lg:font-semibold max-lg:backdrop-blur-none',
                      isLive && 'max-lg:border-transparent max-lg:bg-red',
                    )}
                  >
                    <span className="max-lg:hidden">
                      {postDate({ eventDate: post.eventDate, createdAt: post.eventDate }, locale)}
                    </span>
                    <span className="lg:hidden">
                      {isLive ? t('app.liveNow') : eventTime(post.eventDate, locale)}
                    </span>
                  </span>
                )}
                <span className="absolute right-3 bottom-3 left-3 max-lg:inset-x-2 max-lg:bottom-2">
                  <strong className="block text-label leading-[1.2] max-lg:line-clamp-2 max-lg:text-micro max-lg:font-semibold max-lg:wrap-anywhere">
                    {post.title}
                  </strong>
                  <span className="mt-1 block text-micro font-medium text-white-80 max-lg:hidden">
                    {post.university}
                  </span>
                </span>
              </Link>
            );
          })}
      </div>
    </>
  );
}
