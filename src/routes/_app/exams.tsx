import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { examsSearchSchema } from '@/schemas';
import { UITopbar } from '@/ui/components';
import {
  CourseList,
  CreateCourseButton,
  MaterialFilters,
  MaterialTable,
  ProfessorList,
} from '@/components/features/exams';

export const Route = createFileRoute('/_app/exams')({
  validateSearch: (search: Record<string, unknown>) => examsSearchSchema.parse(search),
  component: ExamsPage,
});

function ExamsPage() {
  const { t } = useTranslation();
  const { tab } = Route.useSearch();

  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col overflow-hidden lg:h-[calc(100svh-56px)]">
      <div className="shrink-0">
        {/* Upload returns once POST /media/uploads accepts kind exam (Uniezz/uniezz-backend#79). */}
        <UITopbar title={t('exams.title')} subtitle={t('exams.subtitle')}>
          {tab === 'reviews' && <CreateCourseButton />}
        </UITopbar>
        <MaterialFilters />
      </div>
      {tab === 'reviews' ? (
        <CourseList />
      ) : tab === 'professors' ? (
        <ProfessorList />
      ) : (
        <MaterialTable />
      )}
      <Outlet />
    </div>
  );
}
