import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import { useProfileSearch, useUniversities } from '@/hooks';
import { VirtuosoGrid } from 'react-virtuoso';
import { UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { gridComponents } from '@/ui/virtuoso';
import { sampleProfile } from '@/utils/profileSkeletonData';
import { StudentCard } from './StudentCard';

// Virtuoso renders whole rows, so the first item on screen always starts a row and odd children sit in the left column.
const gridClass =
  '-mb-px grid md:grid-cols-2 [&>*]:border-b [&>*]:border-white-10 md:[&>*:nth-child(odd)]:border-r';

export function StudentSearchResults({ search, name }: { search: string; name: string }) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useProfileSearch(name);
  const { data: universities } = useUniversities();
  const students = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const loading = isPending || name !== search.trim();
  const skeletons = [0, 1, 2].map((index) => ({ ...sampleProfile, id: `skeleton-${index}` }));
  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      {isError && !loading && <UIQueryError retry={() => void refetch()} />}
      {!loading && !isError && students.length === 0 && (
        <UIEmpty>
          <p className="font-semibold text-white">{t('students.noResults')}</p>
          {search.trim() && (
            <p className="mt-1 text-detail text-secondary">{t('students.tryAnotherName')}</p>
          )}
        </UIEmpty>
      )}
      {(loading || students.length > 0) && (
        <UIPanel surface="tint" className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
          {loading ? (
            <Skeleton loading label={t('apiState.loading')}>
              <div inert className={gridClass}>
                {skeletons.map((student) => (
                  <StudentCard key={student.id} student={student} search={search} />
                ))}
              </div>
            </Skeleton>
          ) : (
            <VirtuosoGrid
              data={students}
              computeItemKey={(_, student) => student.id}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
              }}
              components={gridComponents}
              listClassName={gridClass}
              role="region"
              aria-label={t('students.results')}
              tabIndex={0}
              className="min-h-0 flex-1 overscroll-y-none focus-visible:outline-2 focus-visible:outline-blue"
              itemContent={(_, student) => (
                <StudentCard
                  student={student}
                  search={search}
                  university={universities?.find((item) => item.id === student.universityId)?.name}
                />
              )}
            />
          )}
        </UIPanel>
      )}
    </div>
  );
}
