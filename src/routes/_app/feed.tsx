import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { UIButton, UITopbar } from '@/ui/components';
import { TextFormDialog, CampusStories, FeedPosts } from '@/components/features/feed';

export const Route = createFileRoute('/_app/feed')({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    compose?: boolean;
  } => ({
    compose: search.compose === true || undefined,
  }),
  component: FeedPage,
});
function FeedPage() {
  const { compose } = Route.useSearch();
  const navigate = Route.useNavigate();
  const onComposeClose = (): void => {
    navigate({ search: {} });
  };
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  // TODO(api): Replace local post storage and submission with the feed API.
  const [posts, setPosts] = useState<string[]>([]);
  return (
    <>
      <UITopbar
        title={t('app.today')}
        subtitle={t('app.feedSubtitle')}
        search={{ value: search, onChange: setSearch, label: t('app.searchUniezz') }}
      />
      <UIButton
        className="mb-4 lg:hidden"
        size="sm"
        leftIcon={Plus}
        onClick={() => {
          navigate({ search: { compose: true } });
        }}
      >
        {t('app.newPost')}
      </UIButton>
      <CampusStories search={search} />
      <FeedPosts posts={posts} search={search} />
      {compose && (
        <TextFormDialog
          title={t('app.newPost')}
          onClose={onComposeClose}
          onSubmit={(text) => setPosts((posts) => [text, ...posts])}
        />
      )}
    </>
  );
}
