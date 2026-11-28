import { createFileRoute, redirect } from '@tanstack/react-router';
import { UploadMaterial } from '@/components/features/exams';
import { useGoBack } from '@/hooks';

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
  const goBack = useGoBack();
  const handleClose = (ignoreBlocker = false) =>
    goBack(
      { to: '/exams/courses/$courseId', params: { courseId }, search: { tab: 'reviews' } },
      ignoreBlocker,
    );
  return <UploadMaterial courseId={courseId} onClose={handleClose} />;
}
