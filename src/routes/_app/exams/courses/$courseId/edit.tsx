import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { CourseFormDialog } from '@/components/features/exams/CourseFormDialog';
import { useCourse } from '@/hooks';
import { UIDialog, UIEmpty, UIQueryError } from '@/ui/components';

export const Route = createFileRoute('/_app/exams/courses/$courseId/edit')({
  beforeLoad: ({ search, params }) => {
    if (search.tab !== 'reviews')
      throw redirect({
        to: '/exams/courses/$courseId/edit',
        params,
        search: { ...search, tab: 'reviews' },
        replace: true,
      });
  },
  remountDeps: ({ params }) => params.courseId,
  component: EditCoursePage,
});

function EditCoursePage() {
  const { courseId } = Route.useParams();
  const navigate = Route.useNavigate();
  const { t } = useTranslation();
  const { data: course, isPending, isError, refetch } = useCourse(courseId);
  const close = (ignoreBlocker = false) =>
    void navigate({
      to: '/exams/courses/$courseId',
      params: { courseId },
      search: { tab: 'reviews' },
      replace: true,
      ignoreBlocker,
    });
  if (course?.isMine) return <CourseFormDialog course={course} onClose={close} />;
  return (
    <UIDialog
      open
      placement="right"
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title={t('courses.edit')}
      description={t('courses.formDescription')}
    >
      {isPending ? (
        <p role="status">{t('apiState.loading')}</p>
      ) : isError ? (
        <UIQueryError retry={() => void refetch()} />
      ) : (
        <UIEmpty />
      )}
    </UIDialog>
  );
}
