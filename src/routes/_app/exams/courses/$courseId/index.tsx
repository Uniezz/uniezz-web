import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { CourseDetailsDialog, CoursePhoneScreen } from '@/components/features/exams';
import { usePhoneViewport } from '@/hooks';

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
  const navigate = Route.useNavigate();
  const router = useRouter();
  const { courseFrom } = Route.useSearch();
  // on a phone, the mobile app's pushed course screen instead of the side dialog
  const isPhone = usePhoneViewport();
  const handleClose = () =>
    void (courseFrom
      ? router.navigate({ href: courseFrom, replace: true })
      : navigate({
          to: '/exams',
          search: (previous) => ({ ...previous, tab: 'reviews' }),
          replace: true,
          resetScroll: false,
        }));
  return isPhone ? (
    <CoursePhoneScreen courseId={courseId} onClose={handleClose} />
  ) : (
    <CourseDetailsDialog courseId={courseId} onClose={handleClose} />
  );
}
