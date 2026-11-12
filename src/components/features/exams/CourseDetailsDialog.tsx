import type { CourseDetailsDialogProps } from '@/@types';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Flame, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCourse, useRateCourse, useUniversities } from '@/hooks';
import { UIButton, UIDialog, UIQueryError, UIUniversityLogo } from '@/ui/components';
import { ReportButton } from '@/components/features/reports/ReportButton';
import { CourseComments } from './CourseComments';
import { CourseMaterials } from './CourseMaterials';
import { RatingInput } from './RatingInput';

export function CourseDetailsDialog({ courseId, onClose }: CourseDetailsDialogProps) {
  const { t } = useTranslation();
  const { data: course, isPending, isError, refetch } = useCourse(courseId);
  const { data: universities = [] } = useUniversities();
  const { mutate: rate, isPending: isRating } = useRateCourse();
  const navigate = useNavigate();
  return (
    <>
      <UIDialog
        placement="right"
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
            <div>
              <h3 className="text-micro font-semibold text-secondary">
                {t('courses.description')}
              </h3>
              <p className="mt-1 wrap-anywhere whitespace-pre-wrap">{course.description}</p>
            </div>
            <div>
              <h3 className="text-micro font-semibold text-secondary">{t('courses.difficulty')}</h3>
              <div className="mt-1">
                <RatingInput average={course.difficulty} count={0} readOnly icon={Flame} />
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-label">
              <div>
                <dt className="text-micro font-semibold text-secondary">{t('app.university')}</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <UIUniversityLogo universityId={course.universityId} />
                  <span className="min-w-0 wrap-anywhere">
                    {universities.find(({ id }) => id === course.universityId)?.name ??
                      course.universityId}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-micro font-semibold text-secondary">{t('app.faculty')}</dt>
                <dd className="wrap-anywhere">{course.faculty}</dd>
              </div>
              <div>
                <dt className="text-micro font-semibold text-secondary">{t('app.subject')}</dt>
                <dd className="wrap-anywhere">{course.subject}</dd>
              </div>
              <div>
                <dt className="text-micro font-semibold text-secondary">{t('app.semester')}</dt>
                <dd>{course.semester}</dd>
              </div>
            </dl>
            <RatingInput
              average={course.ratingAverage}
              count={course.ratingCount}
              analyticsLabel="Rate course"
              disabled={isRating}
              onRate={(rating) =>
                rate({ id: courseId, rating }, { onError: () => toast.error(t('apiState.error')) })
              }
            />
            <CourseMaterials courseId={courseId} />
            <CourseComments
              courseId={courseId}
              actions={
                <>
                  {course.isMine && (
                    <UIButton
                      size="pill"
                      bg="transparent"
                      className="min-h-0 gap-1 border-0 p-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
                      aria-label={t('courses.edit')}
                      onClick={() =>
                        void navigate({
                          to: '/exams/courses/$courseId/edit',
                          params: { courseId },
                          search: (previous) => ({ ...previous, tab: 'reviews' }),
                        })
                      }
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      {t('courses.edit')}
                    </UIButton>
                  )}
                  <ReportButton targetType="course" targetId={courseId} danger />
                </>
              }
            />
          </div>
        )}
      </UIDialog>
    </>
  );
}
