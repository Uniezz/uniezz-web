import type { FeedFilters, FeedPost, FeedPostSource } from '@/@types';
import { useMemo, useState } from 'react';
import { Masonry, useInfiniteLoader, type RenderComponentProps } from 'masonic';
import { Skeleton } from 'skullet/react';
import { useTranslation } from 'react-i18next';
import { UIButton, UIEmpty, UIQueryError } from '@/ui/components';
import { useFeedPosts, usePhoneViewport } from '@/hooks';
import { FEED_SKELETON_COUNT, samplePost } from '@/utils';
import { FeedPostCard } from './FeedPostCard';
import { PostCardSkeleton } from './PostCardSkeleton';

function FeedPostsSkeleton() {
  return (
    <div inert className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <FeedPostCard key={index} post={samplePost} />
      ))}
    </div>
  );
}

export function FeedPosts({
  search,
  filters,
  source = 'posts',
}: {
  search: string;
  filters?: FeedFilters;
  source?: FeedPostSource;
}) {
  const { t } = useTranslation();
  const isPhone = usePhoneViewport();
  const queryFilters = useMemo(
    () => ({ ...filters, q: search.trim() || undefined }),
    [filters, search],
  );
  const renderPost = useMemo(
    () =>
      function FeedPostItem({ data }: RenderComponentProps<FeedPost>) {
        return <FeedPostCard post={data} filters={queryFilters} source={source} />;
      },
    [queryFilters, source],
  );
  const {
    data,
    isPending,
    isPlaceholderData,
    isError,
    refetch,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useFeedPosts(queryFilters, source);

  const items = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const maybeLoadMore = useInfiniteLoader(
    () => {
      if (hasNextPage && !isFetching && !isError && !isPlaceholderData) {
        void fetchNextPage({ cancelRefetch: false });
      }
    },
    { threshold: 4 },
  );
  // Masonic caches positions by index, so the grid remounts unless posts were only appended
  // (next page): a shorter list throws, and a new first post (prepend, new search) overlaps cards.
  const first = items[0]?.id;
  const [layout, setLayout] = useState({ count: items.length, first, key: 0 });
  if (items.length !== layout.count || first !== layout.first) {
    const appended = items.length > layout.count && first === layout.first;
    setLayout({ count: items.length, first, key: layout.key + Number(!appended) });
  }

  // On a phone, the mobile app's list: placeholder cards, a centred error or empty state, infinite scroll.
  if (isPhone) {
    if (isPending) {
      return (
        <div className="flex flex-col gap-4">
          {Array.from({ length: FEED_SKELETON_COUNT }, (_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="flex min-h-[50svh] items-center justify-center text-center">
          {isError ? (
            <UIQueryError retry={() => void refetch()} />
          ) : (
            !isPlaceholderData && <UIEmpty />
          )}
        </div>
      );
    }
  }

  return (
    <Skeleton loading={isPending} label={t('apiState.loading')}>
      {isPending ? (
        <FeedPostsSkeleton />
      ) : (
        <div className="space-y-6 transition-opacity duration-200 max-lg:space-y-4 lg:motion-safe:animate-rise-in">
          {items.length > 0 ? (
            <Masonry
              key={layout.key}
              items={items}
              itemKey={(post) => post.id}
              columnWidth={300}
              columnGutter={isPhone ? 16 : 24}
              maxColumnCount={isPhone ? 1 : 3}
              render={renderPost}
              onRender={maybeLoadMore}
              role="list"
            />
          ) : (
            // Placeholder data is the previous search's result, so its emptiness says nothing yet.
            !isError && !isPlaceholderData && <UIEmpty />
          )}
          {isError && <UIQueryError retry={() => void refetch()} />}
          {isPhone && isFetchingNextPage && <PostCardSkeleton />}
          {hasNextPage && !isPhone && (
            <UIButton
              bg="secondary"
              disabled={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              {t('apiState.loadMore')}
            </UIButton>
          )}
        </div>
      )}
    </Skeleton>
  );
}
