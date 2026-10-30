import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';

import { EXAMSMOCKS, matchesSearch, optionalSearchString } from '@/utils';
import type { ExamsFilters } from '@/@types';
import { UIButton, UIPanel, UITopbar } from '@/ui/components';
import { MaterialFilters, MaterialTable, UploadMaterialButton } from '@/components/features/exams';

export const Route = createFileRoute('/_app/exams')({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    material?: string;
  } => ({
    material: optionalSearchString(search.material),
  }),
  component: ExamsPage,
  remountDeps: ({ search }) => search.material,
});
function ExamsPage() {
  const { material } = Route.useSearch();
  const { t } = useTranslation();
  const [rows, setRows] = useState(EXAMSMOCKS.materials);
  const filters = useForm<ExamsFilters>({
    defaultValues: {
      search: material && EXAMSMOCKS.materials.some((m) => m.subject === material) ? material : '',
      tab: 'papers',
      university: '',
    },
  });
  const { search, tab, university } = useWatch({ control: filters.control });
  const filtered = rows.filter(
    (m) =>
      matchesSearch(search ?? '', m.subject, m.author, m.university) &&
      (!university || m.university === university) &&
      (tab !== 'mine' || m.own),
  );
  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col overflow-hidden lg:h-[calc(100svh-56px)]">
      <div className="shrink-0">
        <UITopbar title={t('exams.title')} subtitle={t('exams.subtitle')}>
          <UploadMaterialButton
            onSubmit={(material) => {
              setRows((rows) => [
                ...rows,
                {
                  ...material,
                  author: 'Jan Kowalski',
                  rating: '—',
                  votes: 0,
                  downloads: '0',
                  own: true,
                },
              ]);
              filters.reset({ search: '', tab: 'mine', university: '' });
            }}
          />
        </UITopbar>
      </div>
      <UIPanel className="mb-5.5 flex shrink-0 flex-wrap items-center gap-6 bg-[linear-gradient(90deg,var(--color-blue-40),var(--color-blue-0)_60%)] p-5.5">
        <div className="w-24 border-r border-white-10 pr-6 text-center">
          <strong className="text-countdown tracking-[-2.5px]">12</strong>
          <p className="text-detail text-secondary">{t('app.daysLeft')}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-detail font-semibold text-sky">{t('app.nextExam')}</p>
          <h2 className="text-card-title font-semibold tracking-[-0.6px]">
            {EXAMSMOCKS.examTitle}
          </h2>
          <p className="mt-1.5 text-body text-white-80">{EXAMSMOCKS.examDescription}</p>
        </div>
        <UIButton
          bg="secondary"
          size="sm"
          onClick={() => {
            filters.reset({ search: 'Thermodynamics', tab: 'papers', university: '' });
          }}
        >
          {t('app.studyPapers')}
        </UIButton>
      </UIPanel>
      <div className="shrink-0">
        <MaterialFilters form={filters} />
      </div>
      <MaterialTable rows={filtered} emptyCategory={tab === 'reviews' || tab === 'professors'} />
    </div>
  );
}
