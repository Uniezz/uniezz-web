import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FeedFilterBar } from './FeedFilterBar';
import { FeedFiltersSheet } from './FeedFiltersSheet';
import { FeedPosts } from './FeedPosts';
import { TopPosts } from './TopPosts';
import { usePhoneViewport, useScrolledPast } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIButton, UISearch, UISearchOverlay, UITopbar } from '@/ui/components';
import { HEADER_COMPACT_OFFSET } from '@/utils';

export function FeedPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isPhone = usePhoneViewport();
  const isCompact = useScrolledPast(HEADER_COMPACT_OFFSET);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);
  // the phone's search runs only on submit, as the mobile app's search overlay
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState('');
  const [filters, setFilters] = useState<Parameters<typeof FeedFilterBar>[0]['filters']>({});
  const { type, university, from } = filters;
  const openNewPost = () =>
    navigate({
      to: '/feed/post/new-post',
      search: { postFrom: undefined },
    });
  const handleSearchOpen = () => {
    setSearchDraft(search);
    setIsSearchOpen(true);
  };
  const handleSearchSubmit = () => {
    setSearch(searchDraft);
    setDebouncedSearch(searchDraft);
  };
  const handleSearchClose = () => setIsSearchOpen(false);
  const isNewPostShown = isCompact || Boolean(debouncedSearch.trim());

  return (
    <>
      <UITopbar
        sticky
        title={t('feed.title')}
        subtitle={t('app.feedSubtitle')}
        compact={isCompact}
        phoneActions={
          <div className="relative flex items-center gap-2">
            {/* fades in left of the row once the list scrolls, so the title keeps its width */}
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('app.newPost')}
              aria-hidden={!isNewPostShown}
              tabIndex={isNewPostShown ? undefined : -1}
              onClick={openNewPost}
              className={cn(
                'absolute top-0 right-full mr-2 motion-safe:transition-[opacity,scale] motion-safe:duration-200',
                !isNewPostShown && 'pointer-events-none scale-60 opacity-0',
              )}
            >
              <Plus size={18} aria-hidden="true" />
            </UIButton>
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('topbar.search')}
              onClick={handleSearchOpen}
            >
              <Search size={18} aria-hidden="true" />
            </UIButton>
            <FeedFiltersSheet filters={filters} onChange={setFilters} />
          </div>
        }
      >
        {!isPhone && (
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
              onClick={openNewPost}
            >
              <Plus size={18} aria-hidden="true" />
            </UIButton>
          </div>
        )}
      </UITopbar>
      <UISearchOverlay
        isOpen={isPhone && isSearchOpen}
        value={searchDraft}
        onChangeText={setSearchDraft}
        onSubmit={handleSearchSubmit}
        onClose={handleSearchClose}
        placeholder={t('feed.search')}
        submitLabel={t('topbar.search')}
      />
      {!debouncedSearch.trim() && <TopPosts />}
      <FeedPosts search={debouncedSearch} filters={{ type, university, from }} />
    </>
  );
}
