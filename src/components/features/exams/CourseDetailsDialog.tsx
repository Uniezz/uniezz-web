import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCourse, useRateCourse, useUniversities } from '@/hooks';
import { UIButton, UIDialog, UIQueryError } from '@/ui/components';
import { ReportButton } from '@/components/features/reports/ReportButton';
import { CourseComments } from './CourseComments';
import { CourseMaterials } from './CourseMaterials';
import { RatingInput } from './RatingInput';

export function CourseDetailsDialog({
  courseId,
  onClose,
}: {
  courseId: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { data: course, isPending, isError, refetch } = useCourse(courseId);
  const { data: universities = [] } = useUniversities();
  const { mutate: rate, isPending: isRating } = useRateCourse();
  const navigate = useNavigate();
  return (
    <>
      <UIDialog
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        title={t('courses.details')}
        description={course?.name ?? t('apiState.loading')}
      >
        {isPending && <p role="status">{t('apiState.loading')}</p>}
        {isError && <UIQueryError retry={() => void refetch()} />}
        {course && (
          <div className="space-y-6">
            <dl className="grid grid-cols-2 gap-3 text-detail">
              <div>
                <dt className="text-secondary">{t('app.university')}</dt>
                <dd>
                  {universities.find(({ id }) => id === course.universityId)?.name ??
                    course.universityId}
                </dd>
              </div>
              <div>
                <dt className="text-secondary">{t('app.faculty')}</dt>
                <dd className="wrap-anywhere">{course.faculty}</dd>
              </div>
              <div>
                <dt className="text-secondary">{t('app.subject')}</dt>
                <dd className="wrap-anywhere">{course.subject}</dd>
              </div>
              <div>
                <dt className="text-secondary">{t('app.semester')}</dt>
                <dd>{course.semester}</dd>
              </div>
              <div>
                <dt className="text-secondary">{t('courses.difficulty')}</dt>
                <dd>{course.difficulty}/5</dd>
              </div>
            </dl>
            <p className="wrap-anywhere whitespace-pre-wrap">{course.description}</p>
            <RatingInput
              average={course.ratingAverage}
              count={course.ratingCount}
              analyticsLabel="Rate course"
              disabled={isRating}
              onRate={(rating) =>
                rate({ id: courseId, rating }, { onError: () => toast.error(t('apiState.error')) })
              }
            />
            <div className="flex flex-wrap gap-3">
              {course.isMine && (
                <UIButton
                  size="sm"
                  bg="secondary"
                  onClick={() =>
                    void navigate({
                      to: '/exams/courses/$courseId/edit',
                      params: { courseId },
                      search: (previous) => ({ ...previous, tab: 'reviews' }),
                    })
                  }
                >
                  {t('courses.edit')}
                </UIButton>
              )}
              <ReportButton targetType="course" targetId={courseId} />
            </div>
            <CourseMaterials courseId={courseId} />
            <CourseComments courseId={courseId} />
          </div>
        )}
      </UIDialog>
    </>
  );
}
