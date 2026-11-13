import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { examsSearchSchema } from '@/schemas';
import { UITopbar } from '@/ui/components';
import {
  CourseList,
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
  const { tab = 'reviews' } = Route.useSearch();

  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col overflow-hidden lg:h-[calc(100svh-56px)]">
      <div className="shrink-0">
        <UITopbar title={t('exams.title')} subtitle={t('exams.subtitle')} />
        <MaterialFilters />
      </div>
      <div
        id="exams-tab-panel"
        role="tabpanel"
        aria-labelledby={`exams-tab-${tab}`}
        tabIndex={0}
        className="flex min-h-0 flex-1 flex-col"
      >
        {tab === 'reviews' ? (
          <CourseList />
        ) : tab === 'professors' ? (
          <ProfessorList />
        ) : (
          <MaterialTable />
        )}
      </div>
      <Outlet />
    </div>
  );
}
