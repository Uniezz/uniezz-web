import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { Course } from '@/@types';
import { useRateCourse } from '@/hooks';
import { apiErrorKey, toast } from '@/utils';
import { DifficultyFlames } from './DifficultyFlames';
import { StudyRatingRow } from './StudyRatingRow';

export type CoursePhoneRowProps = { course: Course; universityName?: string };

/** The mobile app's course StudyRow: one glass card that opens the course. */
export const CoursePhoneRow = memo(function CoursePhoneRow({
  course,
  universityName,
}: CoursePhoneRowProps) {
  const { t } = useTranslation();
  const { mutate: rate, isPending: isRating, variables } = useRateCourse();
  const handleRate = (rating: number) =>
    rate({ id: course.id, rating }, { onError: (error) => toast.error(t(apiErrorKey(error))) });
  return (
    <li className="relative flex flex-col gap-3 rounded-2xl p-3 glass">
      <Link
        to="/exams/courses/$courseId"
        params={{ courseId: course.id }}
        search={(previous) => ({ ...previous, tab: 'reviews' })}
        resetScroll={false}
        data-ph-capture-attribute-label="Open course details"
        className="flex min-w-0 flex-col gap-0.75 rounded-2xl after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-blue"
      >
        <span className="truncate text-body leading-5 font-semibold">{course.name}</span>
        <span className="truncate text-micro text-secondary">
          {universityName ?? course.universityId}
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="min-w-0 flex-1 truncate text-micro text-secondary">
            {course.subject} · {t('study.semesterShort', { semester: course.semester })}
          </span>
          <DifficultyFlames difficulty={course.difficulty} />
        </span>
      </Link>
      <StudyRatingRow
        average={course.ratingAverage}
        count={course.ratingCount}
        // the picked stars show while the rating saves, then the API's
        myRating={isRating && variables?.id === course.id ? variables.rating : course.myRating}
        disabled={isRating}
        analyticsLabel="Rate course"
        onRate={handleRate}
      />
    </li>
  );
});
