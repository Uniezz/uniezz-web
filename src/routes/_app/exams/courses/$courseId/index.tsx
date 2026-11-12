import { createFileRoute, redirect } from '@tanstack/react-router';
import { CourseDetailsDialog } from '@/components/features/exams/CourseDetailsDialog';

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
  return (
    <CourseDetailsDialog
      courseId={courseId}
      onClose={() =>
        void navigate({
          to: '/exams',
          search: (previous) => ({ ...previous, tab: 'reviews' }),
          replace: true,
        })
      }
    />
  );
}
