import { createFileRoute, redirect } from '@tanstack/react-router';
import { CourseDetailsDialog, CoursePhoneScreen } from '@/components/features/exams';
import { useGoBack, usePhoneViewport } from '@/hooks';

export const Route = createFileRoute('/_app/exams/courses/$courseId/')({
  beforeLoad: ({ search, params }) => {
    if (search.tab !== 'reviews')
      throw redirect({
        to: '/exams/courses/$courseId',
        params,
        search: { ...search, tab: 'reviews' },
        replace: true,
      });
  },
  component: CourseDetailsPage,
});
function CourseDetailsPage() {
  const { courseId } = Route.useParams();
  const goBack = useGoBack();
  const { courseFrom } = Route.useSearch();
  // on a phone, the mobile app's pushed course screen instead of the side dialog
  const isPhone = usePhoneViewport();
  const handleClose = () =>
    goBack(
      courseFrom
        ? { href: courseFrom }
        : { to: '/exams', search: { tab: 'reviews' }, resetScroll: false },
    );
  return isPhone ? (
    <CoursePhoneScreen courseId={courseId} onClose={handleClose} />
  ) : (
    <CourseDetailsDialog courseId={courseId} onClose={handleClose} />
  );
}
