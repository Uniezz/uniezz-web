import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Skeleton } from 'skullet/react';
import { useProfileSearch, useUniversities } from '@/hooks';
import { UIButton, UIPanel, UIQueryError } from '@/ui/components';
import { sampleProfile } from '@/utils/profileSkeletonData';
import { StudentCard } from './StudentCard';

export function StudentSearchResults({ search, name }: { search: string; name: string }) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useProfileSearch(name);
  const { data: universities } = useUniversities();
  const students = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const loading = isPending || name !== search.trim();
  const displayed = loading
    ? [0, 1, 2].map((index) => ({ ...sampleProfile, id: `skeleton-${index}` }))
    : students;
  return (
    <Skeleton loading={loading} label={t('apiState.loading')} className="mx-auto max-w-4xl">
      <div className="space-y-5">
        {isError && !loading && <UIQueryError retry={() => void refetch()} />}
        {!loading && !isError && students.length === 0 && (
          <UIPanel surface="tint" className="space-y-1 text-center" role="status">
            <p className="text-label font-semibold">{t('students.noResults')}</p>
            {search.trim() && (
              <p className="text-detail text-secondary">{t('students.tryAnotherName')}</p>
            )}
          </UIPanel>
        )}
        {displayed.length > 0 && (
          <UIPanel surface="tint" className="overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white-10 px-4 py-4 sm:px-6">
              <h2 className="flex items-center gap-2.5 text-label font-semibold">
                <Search className="size-4 text-sky" aria-hidden="true" />
                {t(search.trim() ? 'students.results' : 'students.allStudents')}
              </h2>
              {search.trim() && (
                <p className="min-w-0 text-detail wrap-anywhere text-secondary">{search.trim()}</p>
              )}
            </div>
            <div className="divide-y divide-white-10">
              {displayed.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  search={search}
                  university={universities?.find((item) => item.id === student.universityId)?.name}
                />
              ))}
            </div>
          </UIPanel>
        )}
        {hasNextPage && !loading && (
          <UIButton
            bg="secondary"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {t('apiState.loadMore')}
          </UIButton>
        )}
      </div>
    </Skeleton>
  );
}
