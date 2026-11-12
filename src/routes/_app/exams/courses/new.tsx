import { createFileRoute, redirect } from '@tanstack/react-router';
import { CourseFormDialog } from '@/components/features/exams/CourseFormDialog';

export const Route = createFileRoute('/_app/exams/courses/new')({
  beforeLoad: ({ search }) => {
    if (search.tab !== 'reviews')
      throw redirect({
        to: '/exams/courses/new',
        search: { ...search, tab: 'reviews' },
        replace: true,
      });
  },
  component: NewCoursePage,
});

function NewCoursePage() {
  const navigate = Route.useNavigate();
  return (
    <CourseFormDialog
      onClose={(ignoreBlocker = false) =>
        void navigate({
          to: '/exams',
          search: (previous) => ({ ...previous, tab: 'reviews' }),
          replace: true,
          ignoreBlocker,
        })
      }
    />
  );
}
