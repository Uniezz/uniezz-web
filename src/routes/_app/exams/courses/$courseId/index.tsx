import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { CourseDetailsDialog } from '@/components/features/exams';

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
  return (
    <CourseDetailsDialog
      courseId={courseId}
      onClose={() =>
        void (courseFrom
          ? router.navigate({ href: courseFrom, replace: true })
          : navigate({
              to: '/exams',
              search: (previous) => ({ ...previous, tab: 'reviews' }),
              replace: true,
            }))
      }
    />
  );
}
