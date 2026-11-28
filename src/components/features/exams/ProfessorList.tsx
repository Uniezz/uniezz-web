import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from '@/utils';
import { TableVirtuoso } from 'react-virtuoso';
import { MessageSquareText } from 'lucide-react';
import { useProfessors, useRateProfessor, useUniversities } from '@/hooks';
import { UIButton, UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { fixedTable, tableCellTextClass, tableHeaderCellClass } from '@/ui/virtuoso';
import { RatingInput } from './RatingInput';
import { phoneTableClass } from './phoneTable';
import { ProfessorReviewsDialog } from './ProfessorReviewsDialog';

// Name columns share the spare width; the rest fit their longest label in every language.
const columnWidths = ['', '', '13rem', '8rem'];
const tableComponents = fixedTable(columnWidths);

export function ProfessorList() {
  const { t } = useTranslation();
  const { university, q = '', professor: openProfessorId } = useSearch({ from: '/_app/exams' });
  const navigate = useNavigate({ from: '/exams' });
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useProfessors({ universityId: university, q });
  const { data: universities = [] } = useUniversities();
  const { mutate: rate, isPending: isRating, variables: pendingRate } = useRateProfessor();
  const professors = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  return (
    <UIPanel className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 max-lg:rounded-2xl max-lg:p-0">
      {!isPending && !isError && professors.length === 0 ? (
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
                  {[t('app.professor'), t('app.university'), t('app.rating')].map((label) => (
                    <th key={label} scope="col" className={tableHeaderCellClass}>
                      {label}
                    </th>
                  ))}
                  {/* The row's button already says "Reviews"; a visible header would repeat it. */}
                  <th scope="col" className={tableHeaderCellClass}>
                    <span className="sr-only">{t('professors.reviews')}</span>
                  </th>
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
              className={`scrollbar-gray min-h-0 flex-1 ${phoneTableClass}`}
              itemContent={(_, professor) => (
                <>
                  <td className="border-t border-white-5 px-4 py-3 font-semibold max-lg:truncate">
                    {[professor.degree, professor.name].filter(Boolean).join(' ')}
                  </td>
                  <td className={`${tableCellTextClass} max-lg:truncate`}>
                    {universities.find(({ id }) => id === professor.universityId)?.name}
                  </td>
                  <td className="border-t border-white-5 px-4 py-3">
                    <RatingInput
                      average={professor.ratingAverage}
                      count={professor.ratingCount}
                      myRating={professor.myRating}
                      analyticsLabel="Rate professor"
                      disabled={isRating && pendingRate.id === professor.id}
                      onRate={(rating) =>
                        rate(
                          { id: professor.id, rating },
                          { onError: () => toast.error(t('apiState.error')) },
                        )
                      }
                    />
                  </td>
                  <td className="border-t border-white-5 px-4 py-3">
                    <UIButton
                      size="pill"
                      bg="transparent"
                      className="min-h-0 gap-1.5 border-0 p-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
                      onClick={() =>
                        void navigate({
                          search: (previous) => ({ ...previous, professor: professor.id }),
                        })
                      }
                      data-ph-capture-attribute-label="Open professor reviews"
                    >
                      <MessageSquareText className="size-4" aria-hidden="true" />
                      {t('professors.openReviews')}
                    </UIButton>
                  </td>
                </>
              )}
            />
          </div>
        </div>
      )}
      {isError && <UIQueryError retry={() => void refetch()} />}
      {openProfessorId && (
        <ProfessorReviewsDialog
          professorId={openProfessorId}
          onClose={() =>
            void navigate({
              search: (previous) => ({ ...previous, professor: undefined }),
              replace: true,
            })
          }
        />
      )}
    </UIPanel>
  );
}
