import { createContext, useState } from 'react';
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { UIButton, UISearch, UITopbar } from '@/ui/components';
import type { FeedPost } from '@/@types';

type FeedContextValue = {
  posts: FeedPost[];
  setPosts: React.Dispatch<React.SetStateAction<FeedPost[]>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const FeedContext = createContext<FeedContextValue | null>(null);

export const Route = createFileRoute('/_app/feed')({
  component: FeedPage,
});

function FeedPage() {
  const navigate = Route.useNavigate();
  const { pathname } = useLocation();
  const isFeedIndex = pathname === '/feed' || pathname === '/feed/';
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  // TODO(api): Replace local post storage and submission with the feed API.
  const [posts, setPosts] = useState<FeedPost[]>([]);

  return (
    <FeedContext.Provider value={{ posts, setPosts, search, setSearch }}>
      {isFeedIndex && (
        <UITopbar title={t('app.today')} subtitle={t('app.feedSubtitle')}>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="min-w-0 flex-1 sm:w-75">
              <UISearch
                value={search}
                onChange={setSearch}
                label={t('app.searchUniezz')}
                className="gap-2.5 px-4 text-body backdrop-blur-[40px] [&_svg]:size-4.25"
              />
            </div>
            <UIButton
              className="size-10 shrink-0 backdrop-blur-[40px]"
              size="icon"
              bg="secondary"
              aria-label={t('app.newPost')}
              title={t('app.newPost')}
              onClick={() =>
                navigate({
                  to: '/feed/new-post',
                  search: { postId: undefined, feedRoute: 'new-post' },
                })
              }
            >
              <Plus size={18} aria-hidden="true" />
            </UIButton>
          </div>
        </UITopbar>
      )}
      <Outlet />
    </FeedContext.Provider>
  );
}
