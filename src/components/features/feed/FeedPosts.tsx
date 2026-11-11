import type { FeedFilters } from '@/@types';
import { useState } from 'react';
import { Masonry, useInfiniteLoader, type RenderComponentProps } from 'masonic';
import type { FeedPost } from '@/@types';
import { Skeleton } from 'skullet/react';
import { useTranslation } from 'react-i18next';
import { UIButton, UIEmpty, UIQueryError } from '@/ui/components';
import { useFeedPosts, type FeedPostSource } from '@/hooks';
import { samplePost } from '@/utils/feedSkeletonData';
import { FeedPostCard } from './FeedPostCard';

function FeedCard({ data }: RenderComponentProps<FeedPost>) {
  return <FeedPostCard post={data} />;
}

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
  /** Search and filters only apply to the feed; liked and saved ignore them. */
  source?: FeedPostSource;
}) {
  const { t } = useTranslation();
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
  } = useFeedPosts({ ...filters, q: search.trim() || undefined }, source);

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

  return (
    <Skeleton loading={isPending} label={t('apiState.loading')}>
      {isPending ? (
        <FeedPostsSkeleton />
      ) : (
        <div className="space-y-6 transition-opacity duration-200 motion-safe:animate-rise-in">
          {items.length > 0 ? (
            <Masonry
              key={layout.key}
              items={items}
              itemKey={(post) => post.id}
              columnWidth={300}
              columnGutter={24}
              maxColumnCount={3}
              render={FeedCard}
              onRender={maybeLoadMore}
              role="list"
            />
          ) : (
            // Placeholder data is the previous search's result, so its emptiness says nothing yet.
            !isError && !isPlaceholderData && <UIEmpty />
          )}
          {isError && <UIQueryError retry={() => void refetch()} />}
          {hasNextPage && (
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
