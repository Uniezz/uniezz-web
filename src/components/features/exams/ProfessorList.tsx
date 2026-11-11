import { useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { TableVirtuoso } from 'react-virtuoso';
import { useProfessors, useRateProfessor, useUniversities } from '@/hooks';
import { UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { tableComponents } from '@/ui/virtuoso';
import { matchesSearch } from '@/utils';
import { RatingInput } from './RatingInput';

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
              <td className="border-t border-white-5 px-4 py-3 text-label text-white-80">
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
      )}
      {isError && <UIQueryError retry={() => void refetch()} />}
    </UIPanel>
  );
}
