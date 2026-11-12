import { createFileRoute, redirect } from '@tanstack/react-router';
import { UploadMaterial } from '@/components/features/exams/UploadMaterial';

export const Route = createFileRoute('/_app/exams/courses/$courseId/upload')({
  beforeLoad: ({ search, params }) => {
    if (search.tab !== 'reviews')
      throw redirect({
        to: '/exams/courses/$courseId/upload',
        params,
        search: { ...search, tab: 'reviews' },
        replace: true,
      });
  },
  component: UploadMaterialPage,
});
function UploadMaterialPage() {
  const { courseId } = Route.useParams();
  const navigate = Route.useNavigate();
  return (
    <UploadMaterial
      courseId={courseId}
      onClose={(ignoreBlocker = false) =>
        void navigate({
          to: '/exams/courses/$courseId',
          params: { courseId },
          search: (previous) => ({ ...previous, tab: 'reviews' }),
          replace: true,
          ignoreBlocker,
        })
      }
    />
  );
}
