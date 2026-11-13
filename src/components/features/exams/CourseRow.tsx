import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
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
          className="font-semibold wrap-anywhere hover:underline focus-visible:outline-2 focus-visible:outline-blue"
        >
          {course.name}
        </Link>
        <p className="mt-1 text-detail font-medium text-secondary">{universityName}</p>
      </td>
      {[course.subject, course.semester].map((value, index) => (
        <td key={index} className={tableCellTextClass}>
          {value}
        </td>
      ))}
      <td className="border-t border-white-5 px-4 py-3">
        <RatingInput average={course.difficulty} count={0} readOnly icon={Flame} />
      </td>
      <td className="border-t border-white-5 px-4 py-3">
        <RatingInput
          average={course.ratingAverage}
          count={course.ratingCount}
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
