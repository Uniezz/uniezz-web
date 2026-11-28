import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from '@/utils';
import { CourseFormDialog } from '@/components/features/exams';
import i18n from '@/i18n';
import { myProfileQueryOptions, useGoBack } from '@/hooks';

export const Route = createFileRoute('/_app/exams/courses/new')({
  beforeLoad: async ({ context, search }) => {
    if (search.tab !== 'reviews')
      throw redirect({
        to: '/exams/courses/new',
        search: { ...search, tab: 'reviews' },
        replace: true,
      });
    const profile = await context.queryClient.ensureQueryData(myProfileQueryOptions());
    if (!profile.programmes?.length) {
      toast.error(i18n.t('courses.noProgrammes'));
      throw redirect({ to: '/exams', search: { tab: 'reviews' }, replace: true });
    }
  },
  component: NewCoursePage,
});

function NewCoursePage() {
  const goBack = useGoBack();
  const handleClose = (ignoreBlocker = false) =>
    goBack({ to: '/exams', search: { tab: 'reviews' } }, ignoreBlocker);
  return <CourseFormDialog onClose={handleClose} />;
}
