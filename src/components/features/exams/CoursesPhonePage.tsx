import { useTranslation } from 'react-i18next';
import { useCourses, useUniversities } from '@/hooks';
import { CoursePhoneRow } from './CoursePhoneRow';
import { StudyPhoneList } from './StudyPhoneList';

export type StudyPhonePageProps = { query: string; universityId?: string; semester?: number };

/** The mobile app's Courses page. */
export function CoursesPhonePage({ query, universityId, semester }: StudyPhonePageProps) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCourses({ universityId, semester, q: query });
  const { data: universities = [] } = useUniversities();
  const courses = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  return (
    <StudyPhoneList
      label={t('study.tabCourses')}
      isPending={isPending}
      isError={isError}
      isEmpty={courses.length === 0}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      refetch={refetch}
    >
      {courses.map((course) => (
        <CoursePhoneRow
          key={course.id}
          course={course}
          universityName={universities.find(({ id }) => id === course.universityId)?.name}
        />
      ))}
    </StudyPhoneList>
  );
}
