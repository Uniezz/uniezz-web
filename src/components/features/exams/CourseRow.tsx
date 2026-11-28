import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/utils';
import type { Course } from '@/@types';
import { useRateCourse } from '@/hooks';
import { tableCellTextClass } from '@/ui/virtuoso';
import { RatingInput } from './RatingInput';

export const CourseRow = memo(function CourseRow({
  course,
  universityName,
}: {
  course: Course;
  universityName?: string;
}) {
  const { t } = useTranslation();
  const { mutate: rate, isPending: isRating } = useRateCourse();

  return (
    <>
      <td className="border-t border-white-5 px-4 py-3">
        <Link
          to="/exams/courses/$courseId"
          params={{ courseId: course.id }}
          search={(previous) => ({ ...previous, tab: 'reviews' })}
          data-ph-capture-attribute-label="Open course details"
          className="font-semibold wrap-anywhere hover:underline focus-visible:outline-2 focus-visible:outline-blue max-lg:block max-lg:truncate"
        >
          {course.name}
        </Link>
        <p className="mt-1 text-detail font-medium text-secondary max-lg:truncate">
          {universityName}
        </p>
      </td>
      <td className={`${tableCellTextClass} max-lg:truncate`}>{course.subject}</td>
      <td className={tableCellTextClass}>
        <span className="max-lg:hidden">{course.semester}</span>
        {/* a bare number means nothing once the column header is gone on a phone */}
        <span className="whitespace-nowrap lg:hidden">
          {t('exams.semesterNumber', { semester: course.semester })}
        </span>
      </td>
      <td className="border-t border-white-5 px-4 py-3">
        <RatingInput average={course.difficulty} count={0} readOnly icon={Flame} />
      </td>
      <td className="border-t border-white-5 px-4 py-3">
        <RatingInput
          average={course.ratingAverage}
          count={course.ratingCount}
          myRating={course.myRating}
          analyticsLabel="Rate course"
          disabled={isRating}
          onRate={(rating) =>
            rate({ id: course.id, rating }, { onError: () => toast.error(t('apiState.error')) })
          }
        />
      </td>
    </>
  );
});
