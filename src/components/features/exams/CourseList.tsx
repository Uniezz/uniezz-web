import { useState } from 'react';
import { CourseDetailsDialog } from './CourseDetailsDialog';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { TableVirtuoso } from 'react-virtuoso';
import { useSearch } from '@tanstack/react-router';
import { useCourses, useRateCourse, useUniversities } from '@/hooks';
import { UIButton, UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { fixedTable } from '@/ui/virtuoso';
import { matchesSearch } from '@/utils';
import { RatingInput } from './RatingInput';

// Name columns share the spare width; the rest fit their longest label in every language.
const tableComponents = fixedTable(['', '', '7.5rem', '9rem', '13rem']);

export function CourseList() {
  const { t } = useTranslation();
  const [courseId, setCourseId] = useState<string | null>(null);
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
          itemContent={(_, course) => (
            <>
              <td className="border-t border-white-5 px-4 py-3">
                <UIButton
                  bg="transparent"
                  size="pill"
                  data-ph-capture-attribute-label="Open course details"
                  className="max-w-full justify-start text-left whitespace-normal"
                  onClick={() => setCourseId(course.id)}
                >
                  {course.name}
                </UIButton>
                <p className="mt-1 text-detail font-medium text-secondary">
                  {universities.find(({ id }) => id === course.universityId)?.name}
                </p>
              </td>
              <td className="border-t border-white-5 px-4 py-3 text-label text-white-80">
                {course.subject}
              </td>
              <td className="border-t border-white-5 px-4 py-3 text-label text-white-80">
                {course.semester}
              </td>
              <td className="border-t border-white-5 px-4 py-3 text-label text-white-80">
                {course.difficulty}/5
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
      {courseId && (
        <CourseDetailsDialog key={courseId} courseId={courseId} onClose={() => setCourseId(null)} />
      )}
    </UIPanel>
  );
}
