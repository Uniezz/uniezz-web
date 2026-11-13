import { useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { TableVirtuoso } from 'react-virtuoso';
import { useProfessors, useRateProfessor, useUniversities } from '@/hooks';
import { UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { fixedTable, tableCellTextClass, tableHeaderCellClass } from '@/ui/virtuoso';
import { matchesSearch } from '@/utils';
import { RatingInput } from './RatingInput';

// Name columns share the spare width; the rest fit their longest label in every language.
const columnWidths = ['', '', '13rem'];
const tableComponents = fixedTable(columnWidths);

export function ProfessorList() {
  const { t } = useTranslation();
  const { university, q = '' } = useSearch({ from: '/_app/exams' });
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useProfessors(university);
  const { data: universities = [] } = useUniversities();
  const { mutate: rate, isPending: isRating } = useRateProfessor();
  // shortcut: GET /study/professors has no text search, so search filters loaded pages; add `q` server-side if students miss professors.
  const professors = (data?.pages.flatMap((page) => page.items ?? []) ?? []).filter((professor) =>
    matchesSearch(q, professor.name),
  );

  return (
    <UIPanel className="flex min-h-0 flex-1 flex-col overflow-hidden p-2">
      {!isPending && !isError && professors.length === 0 ? (
        <UIEmpty />
      ) : (
        <div className="min-h-0 min-w-0 flex-1 overflow-x-auto">
          <div className="flex h-full min-w-[640px] flex-col">
            <table className="w-full table-fixed text-left text-body">
              <colgroup>
                {columnWidths.map((width, index) => (
                  <col key={index} style={width ? { width } : undefined} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {[t('app.professor'), t('app.university'), t('app.rating')].map((label) => (
                    <th key={label} scope="col" className={tableHeaderCellClass}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
            <TableVirtuoso
              data={professors}
              computeItemKey={(_, professor) => professor.id}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
              }}
              components={tableComponents}
              aria-label={t('app.professorRatings')}
              className="scrollbar-gray min-h-0 flex-1"
              itemContent={(_, professor) => (
                <>
                  <td className="border-t border-white-5 px-4 py-3 font-semibold">
                    {[professor.degree, professor.name].filter(Boolean).join(' ')}
                  </td>
                  <td className={tableCellTextClass}>
                    {universities.find(({ id }) => id === professor.universityId)?.name}
                  </td>
                  <td className="border-t border-white-5 px-4 py-3">
                    <RatingInput
                      average={professor.ratingAverage}
                      count={professor.ratingCount}
                      analyticsLabel="Rate professor"
                      disabled={isRating}
                      onRate={(rating) =>
                        rate(
                          { id: professor.id, rating },
                          { onError: () => toast.error(t('apiState.error')) },
                        )
                      }
                    />
                  </td>
                </>
              )}
            />
          </div>
        </div>
      )}
      {isError && <UIQueryError retry={() => void refetch()} />}
    </UIPanel>
  );
}
