import type { FeedFilters } from '@/@types';
import { Masonry, type RenderComponentProps } from 'masonic';
import { Skeleton } from 'skullet/react';
import { useTranslation } from 'react-i18next';
import type { FeedPost } from '@/@types';
import { UIButton, UIEmpty, UIQueryError } from '@/ui/components';
import { useFeedPosts } from '@/hooks';
import { matchesSearch } from '@/utils';
import { authorName } from '@/utils/feed';
import { samplePost } from '@/utils/feedSkeletonData';
import { FeedPostCard } from './FeedPostCard';

function FeedCard({ data }: RenderComponentProps<FeedPost>) {
  return <FeedPostCard post={data} />;
}

function FeedPostsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <FeedPostCard key={index} post={samplePost} />
      ))}
    </div>
  );
}

export function FeedPosts({ search, filters }: { search: string; filters?: FeedFilters }) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useFeedPosts(filters);
  // shortcut: Search filters loaded pages until the feed API accepts search; then pass it to the API.
  const items = (data?.pages.flatMap((page) => page.items ?? []) ?? []).filter((post) =>
    matchesSearch(
      search,
      post.title,
      authorName(post.author),
      post.university,
      post.content,
      ...(post.tags ?? []),
    ),
  );
  return (
    <Skeleton loading={isPending} label={t('apiState.loading')}>
      {isPending ? (
        <FeedPostsSkeleton />
      ) : (
        <div className="space-y-6">
          {items.length > 0 ? (
            <Masonry
              key={items.map((post) => post.id).join(',')}
              items={items}
              itemKey={(post) => post.id}
              columnWidth={352}
              columnGutter={24}
              maxColumnCount={3}
              render={FeedCard}
              role="list"
            />
          ) : (
            !isError && <UIEmpty />
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
          {search && <p className="text-detail text-secondary">{t('apiState.loadedSearch')}</p>}
        </div>
      )}
    </Skeleton>
  );
}
