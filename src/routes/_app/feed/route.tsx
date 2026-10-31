import { createContext, useState } from 'react';
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { UIButton, UITopbar } from '@/ui/components';
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
        <UITopbar
          title={t('app.today')}
          subtitle={t('app.feedSubtitle')}
          search={{ value: search, onChange: setSearch, label: t('app.searchUniezz') }}
        >
          <UIButton
            className="mb-4 lg:hidden"
            size="sm"
            leftIcon={Plus}
            onClick={() => navigate({ to: '/feed/new-post', search: { postId: undefined } })}
          >
            {t('app.newPost')}
          </UIButton>
        </UITopbar>
      )}
      <Outlet />
    </FeedContext.Provider>
  );
}
