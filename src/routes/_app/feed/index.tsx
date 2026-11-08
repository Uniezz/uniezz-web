import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FeedFilterBar, FeedPosts, TopPosts } from '@/components/features/feed';
import { UIButton, UISearch, UITopbar } from '@/ui/components';

export const Route = createFileRoute('/_app/feed/')({
  beforeLoad: ({ search }) => {
    if (search.feedRoute === 'new-post') {
      throw redirect({ to: '/feed/post/new-post', search });
    }
    if (search.postId) {
      throw redirect({ to: '/feed/post/$postId', params: { postId: search.postId }, search });
    }
  },
  component: FeedIndexPage,
});

function FeedIndexPage() {
  const navigate = Route.useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);
  const [filters, setFilters] = useState<Parameters<typeof FeedFilterBar>[0]['filters']>({});
  const { type, university, from } = filters;

  return (
    <>
      <UITopbar title={t('feed.title')} subtitle={t('app.feedSubtitle')}>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <FeedFilterBar filters={filters} onChange={setFilters} />
          <div className="min-w-0 flex-1 sm:w-75 sm:flex-none">
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
                to: '/feed/post/new-post',
                search: { postId: undefined, feedRoute: 'new-post' },
              })
            }
          >
            <Plus size={18} aria-hidden="true" />
          </UIButton>
        </div>
      </UITopbar>
      {!debouncedSearch.trim() && <TopPosts />}
      <FeedPosts search={debouncedSearch} filters={{ type, university, from }} />
    </>
  );
}
