import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { TableVirtuoso } from 'react-virtuoso';
import { Link, useSearch } from '@tanstack/react-router';
import { useCourses, useRateCourse, useUniversities } from '@/hooks';
import { UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { fixedTable } from '@/ui/virtuoso';
import { matchesSearch } from '@/utils';
import { RatingInput } from './RatingInput';

// Name columns share the spare width; the rest fit their longest label in every language.
const tableComponents = fixedTable(['', '', '7.5rem', '9rem', '13rem']);

export function CourseList() {
  const { t } = useTranslation();
  const { university, semester, q = '' } = useSearch({ from: '/_app/exams' });
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCourses({ universityId: university, semester });
  const { data: universities = [] } = useUniversities();
  const { mutate: rate, isPending: isRating } = useRateCourse();
  // shortcut: GET /study/courses has no text search, so search filters loaded pages; add `q` server-side if students miss courses.
  const courses = (data?.pages.flatMap((page) => page.items ?? []) ?? []).filter((course) =>
    matchesSearch(q, course.name, course.subject, course.faculty),
  );

  return (
    <UIPanel className="flex min-h-0 flex-1 flex-col overflow-hidden p-2">
      {!isPending && !isError && courses.length === 0 ? (
        <UIEmpty />
      ) : (
        <TableVirtuoso
          data={courses}
          computeItemKey={(_, course) => course.id}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
          }}
          components={tableComponents}
          aria-label={t('app.courseReviews')}
          className="scrollbar-gray min-h-0 flex-1"
          fixedHeaderContent={() => (
            <tr>
              {[
                t('courses.name'),
                t('app.subject'),
                t('app.semester'),
                t('courses.difficulty'),
                t('app.rating'),
              ].map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="bg-surface px-4 py-3 text-detail font-semibold text-secondary"
                >
                  {label}
                </th>
              ))}
            </tr>
          )}
          itemContent={(_, course) => (
            <>
              <td className="border-t border-white-5 px-4 py-3">
                <Link
                  to="/exams/courses/$courseId"
                  params={{ courseId: course.id }}
                  search={(previous) => ({ ...previous, tab: 'reviews' })}
                  data-ph-capture-attribute-label="Open course details"
                  className="font-semibold wrap-anywhere hover:underline focus-visible:outline-2 focus-visible:outline-blue"
                >
                  {course.name}
                </Link>
                <p className="mt-1 text-detail font-medium text-secondary">
                  {universities.find(({ id }) => id === course.universityId)?.name}
                </p>
              </td>
              {[course.subject, course.semester].map((value, index) => (
                <td
                  key={index}
                  className="border-t border-white-5 px-4 py-3 text-label text-white-80"
                >
                  {value}
                </td>
              ))}
              <td className="border-t border-white-5 px-4 py-3">
                <RatingInput average={course.difficulty} count={0} readOnly />
              </td>
              <td className="border-t border-white-5 px-4 py-3">
                <RatingInput
                  average={course.ratingAverage}
                  count={course.ratingCount}
                  analyticsLabel="Rate course"
                  disabled={isRating}
                  onRate={(rating) =>
                    rate(
                      { id: course.id, rating },
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
