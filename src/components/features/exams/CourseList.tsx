import { useTranslation } from 'react-i18next';
import { TableVirtuoso } from 'react-virtuoso';
import { useSearch } from '@tanstack/react-router';
import { useCourses, useUniversities } from '@/hooks';
import { UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { fixedTable, tableHeaderCellClass } from '@/ui/virtuoso';
import { CourseRow } from './CourseRow';
import { phoneTableClass } from './phoneTable';

// Name columns share the spare width; the rest fit their longest label in every language.
const columnWidths = ['', '', '7.5rem', '9rem', '13rem'];
const tableComponents = fixedTable(columnWidths);

export function CourseList() {
  const { t } = useTranslation();
  const { university, semester, q = '' } = useSearch({ from: '/_app/exams' });
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCourses({ universityId: university, semester, q });
  const { data: universities = [] } = useUniversities();
  const courses = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  return (
    <UIPanel className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 max-lg:rounded-2xl max-lg:p-0">
      {!isPending && !isError && courses.length === 0 ? (
        <UIEmpty />
      ) : (
        <div className="min-h-0 min-w-0 flex-1 overflow-x-auto">
          <div className="flex h-full min-w-[640px] flex-col max-lg:min-w-0">
            <table className="w-full table-fixed text-left text-body max-lg:hidden">
              <colgroup>
                {columnWidths.map((width, index) => (
                  <col key={index} style={width ? { width } : undefined} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {[
                    t('courses.name'),
                    t('app.programme'),
                    t('app.semester'),
                    t('courses.difficulty'),
                    t('app.rating'),
                  ].map((label) => (
                    <th key={label} scope="col" className={tableHeaderCellClass}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
            <TableVirtuoso
              data={courses}
              computeItemKey={(_, course) => course.id}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
              }}
              components={tableComponents}
              aria-label={t('app.courseReviews')}
              className={`scrollbar-gray min-h-0 flex-1 ${phoneTableClass}`}
              itemContent={(_, course) => (
                <CourseRow
                  course={course}
                  universityName={universities.find(({ id }) => id === course.universityId)?.name}
                />
              )}
            />
          </div>
        </div>
      )}
      {isError && <UIQueryError retry={() => void refetch()} />}
    </UIPanel>
  );
}
