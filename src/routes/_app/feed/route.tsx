import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { FeedPage } from '@/components/features/feed';

export const Route = createFileRoute('/_app/feed')({ component: FeedLayout });

function FeedLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const showFeed =
    pathname === '/feed' || pathname === '/feed/' || pathname === '/feed/post/new-post';
  return (
    <>
      {showFeed && <FeedPage />}
      <Outlet />
    </>
  );
}
