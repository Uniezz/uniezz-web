import { Masonry, type RenderComponentProps } from 'masonic';
import type { FeedPost } from '@/@types';
import { UIEmpty } from '@/ui/components';
// TODO(api): Replace mock feed data and local filtering with API-backed feed queries.
import { FEEDMOCKS, matchesSearch } from '@/utils';
import { FeedPostCard } from './FeedPostCard';

function FeedCard({ data }: RenderComponentProps<FeedPost>) {
  return <FeedPostCard post={data} />;
}

export function FeedPosts({ posts, search }: { posts: FeedPost[]; search: string }) {
  const items = [...posts, ...FEEDMOCKS.feed.posts].filter((post) =>
    matchesSearch(search, post.title, post.author, post.university, post.summary),
  );
  return items.length > 0 ? (
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
  ) : search &&
    !FEEDMOCKS.feed.topPosts.some((post) =>
      matchesSearch(search, post.title, post.university, post.summary),
    ) ? (
    <UIEmpty />
  ) : null;
}
