import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { FeedPage } from '@/components/features/feed';
import { usePhoneViewport } from '@/hooks';

export const Route = createFileRoute('/_app/feed')({ component: FeedLayout });

function FeedLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isPhone = usePhoneViewport();
  // on a phone the composer is its own screen, as in the mobile app; from lg up it opens over the feed
  const showFeed =
    pathname === '/feed' ||
    pathname === '/feed/' ||
    (!isPhone && pathname === '/feed/post/new-post');
  return (
    <>
      {showFeed && <FeedPage />}
      <Outlet />
    </>
  );
}
