import { createContext, useState } from 'react';
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { TextFormDialog } from '@/components/features/feed';
import { UIButton, UITopbar } from '@/ui/components';

type FeedContextValue = {
  posts: string[];
  setPosts: React.Dispatch<React.SetStateAction<string[]>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const FeedContext = createContext<FeedContextValue | null>(null);

export const Route = createFileRoute('/_app/feed')({
  validateSearch: (search: Record<string, unknown>): { compose?: boolean } => ({
    compose: search.compose === true || undefined,
  }),
  component: FeedPage,
});

function FeedPage() {
  const { compose } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { pathname } = useLocation();
  const isFeedIndex = pathname === '/feed' || pathname === '/feed/';
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  // TODO(api): Replace local post storage and submission with the feed API.
  const [posts, setPosts] = useState<string[]>([]);

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
            onClick={() => navigate({ search: { compose: true, postId: undefined } })}
          >
            {t('app.newPost')}
          </UIButton>
        </UITopbar>
      )}
      <Outlet />
      {compose && (
        <TextFormDialog
          title={t('app.newPost')}
          onClose={() => navigate({ search: {} })}
          onSubmit={(text) => setPosts((currentPosts) => [text, ...currentPosts])}
        />
      )}
    </FeedContext.Provider>
  );
}
