import { useRouter } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useEndReached, useProfileSearch, useScrolledPast } from '@/hooks';
import {
  UIButton,
  UICollapsingHeader,
  UIEmpty,
  UIQueryError,
  UISearchOverlay,
} from '@/ui/components';
import { HEADER_COMPACT_OFFSET } from '@/utils';
import { StudentRow, StudentRowSkeletons } from './StudentRow';

/** Phone-only: the mobile app's Students screen; the search runs on submit from the header's overlay. */
export function StudentsScreen({
  initialQuery,
  onQueryChange,
}: {
  initialQuery: string;
  onQueryChange: (query: string) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery.trim());
  const [isSearching, setIsSearching] = useState(false);
  const isCompact = useScrolledPast(HEADER_COMPACT_OFFSET);
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useProfileSearch(query);
  const students = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const endRef = useEndReached<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  });

  const handleBack = () =>
    window.history.length > 1
      ? router.history.back()
      : void router.navigate({ to: '/connections' });
  const handleSearchOpen = () => setIsSearching(true);
  const handleSearchClose = () => setIsSearching(false);
  const handleSearchSubmit = () => {
    setQuery(search.trim());
    onQueryChange(search);
  };

  return (
    <div data-hide-bottom-tabs className="-mx-4 -mt-6 px-4">
      <UICollapsingHeader
        title={t('app.students')}
        isCompact={isCompact}
        onBack={handleBack}
        backLabel={t('app.back')}
        actions={
          <UIButton
            size="square"
            bg="glass"
            aria-label={t('topbar.search')}
            onClick={handleSearchOpen}
          >
            <Search size={18} aria-hidden="true" />
          </UIButton>
        }
      />
      <div className="flex flex-col gap-2.5 pt-2 pb-10">
        {isPending ? (
          <StudentRowSkeletons count={8} />
        ) : isError ? (
          <UIQueryError retry={() => void refetch()} />
        ) : (
          <ul aria-label={t('students.results')} className="flex flex-col gap-2.5">
            {students.map((student) => (
              <li key={student.id}>
                <StudentRow student={student} />
              </li>
            ))}
          </ul>
        )}
        {isFetchingNextPage && <StudentRowSkeletons count={1} />}
        <div ref={endRef} aria-hidden="true" />
      </div>
      {/* the cat centres on the screen as every empty state in the app */}
      {!isPending && !isError && students.length === 0 && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <UIEmpty>
            <p>{t('students.noResults')}</p>
          </UIEmpty>
        </div>
      )}
      <UISearchOverlay
        isOpen={isSearching}
        value={search}
        onChangeText={setSearch}
        onSubmit={handleSearchSubmit}
        onClose={handleSearchClose}
        placeholder={t('students.search')}
        submitLabel={t('topbar.search')}
      />
    </div>
  );
}
