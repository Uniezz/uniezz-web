import { Link } from '@tanstack/react-router';
import { Masonry, type RenderComponentProps } from 'masonic';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { UIPanel, UIEmpty } from '@/ui/components';
// TODO(api): Replace mock featured/plain posts, hardcoded IDs/order, local filtering, and interactions with API-backed feed data and mutations.
import { FEEDMOCKS, matchesSearch } from '@/utils';

type FeedPostsProps = {
  posts: string[];
  search: string;
};

type FeedItem = {
  id: string;
  searchText: string;
  content: ReactNode;
};

function FeedCard({ data }: RenderComponentProps<FeedItem>): ReactNode {
  return data.content;
}

export function FeedPosts({ posts, search }: FeedPostsProps) {
  const { t } = useTranslation();

  const items: FeedItem[] = [
    ...posts.map((post, index) => ({
      id: `post-${posts.length - index}`,
      searchText: post,
      content: (
        <UIPanel>
          <p className="mb-3 text-detail text-secondary">{FEEDMOCKS.currentAuthor}</p>
          <p className="wrap-anywhere whitespace-pre-wrap">{post}</p>
        </UIPanel>
      ),
    })),
    ...FEEDMOCKS.feed.posts.map((post) => ({
      id: post.id,
      searchText: `${post.title} ${post.author} ${post.university} ${post.summary}`,
      content:
        post.type === 'question' ? (
          <div className="relative">
            <UIPanel className="p-5.5">
              <p className="text-label font-medium text-white-80">{post.author}</p>
              <p className="mt-1 mb-3 text-detail text-secondary">
                {post.university} · {post.time}
              </p>
              <h2 className="text-card-title font-semibold tracking-[-0.6px]">{post.title}</h2>
            </UIPanel>
            <span className="app-tag pointer-events-none absolute top-3 right-5.5 z-20 border-[#626470] bg-[#3d3f4a] px-2 py-1">
              {t('app.question')}
            </span>
            <Link
              to="/feed/$postId"
              params={{ postId: post.id }}
              search={{ postId: post.id }}
              aria-label={`${t('app.viewPost')}: ${post.title}`}
              className="absolute inset-0 z-10 rounded-3xl"
            />
          </div>
        ) : (
          <div className="group relative">
            <UIPanel className="overflow-hidden p-0">
              {'image' in post && (
                <div className="h-50 overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              )}
              <div className="min-w-0 p-5.5">
                <p className="text-label font-medium text-white-80">{post.author}</p>
                <p className="mt-1 mb-3 text-detail text-secondary">
                  {post.university} · {post.summary}
                </p>
                <h2 className="text-card-title font-semibold tracking-[-0.6px]">{post.title}</h2>
              </div>
            </UIPanel>
            {post.type === 'event' && (
              <span className="app-tag pointer-events-none absolute top-3 left-3 z-20 border-[#626470] bg-[#3d3f4a] px-2 py-1">
                {t('app.event')}
              </span>
            )}
            <Link
              to="/feed/$postId"
              params={{ postId: post.id }}
              search={{ postId: post.id }}
              aria-label={`${t('app.viewPost')}: ${post.title}`}
              className="absolute inset-0 z-10 rounded-3xl"
            />
          </div>
        ),
    })),
  ].filter((item) => matchesSearch(search, item.searchText));

  return (
    <>
      {items.length > 0 ? (
        <Masonry
          key={items.map((item) => item.id).join(',')}
          items={items}
          itemKey={(item) => item.id}
          columnWidth={352}
          columnGutter={24}
          maxColumnCount={3}
          render={FeedCard}
          role="list"
        />
      ) : (
        search &&
        ![...FEEDMOCKS.feed.topPosts, ...FEEDMOCKS.feed.posts].some((post) =>
          matchesSearch(search, post.title, post.university, post.summary),
        ) && <UIEmpty />
      )}
    </>
  );
}
