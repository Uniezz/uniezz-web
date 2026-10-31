import { createFileRoute, redirect } from '@tanstack/react-router';
import { useContext } from 'react';

import { FeedPosts, TopPosts } from '@/components/features/feed';
import { FeedContext } from './route';

export const Route = createFileRoute('/_app/feed/')({
  beforeLoad: ({ search }) => {
    if (search.postId && !search.compose) {
      throw redirect({ to: '/feed/$postId', params: { postId: search.postId }, search });
    }
  },
  component: FeedIndexPage,
});

function FeedIndexPage() {
  const context = useContext(FeedContext);
  if (!context) return null;

  return (
    <>
      <TopPosts search={context.search} />
      <FeedPosts posts={context.posts} search={context.search} />
    </>
  );
}
