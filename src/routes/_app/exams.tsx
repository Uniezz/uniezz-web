import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';

// TODO(api): Replace the mock materials and local row updates with API data and mutations.
import { EXAMSMOCKS, matchesSearch, optionalSearchString } from '@/utils';
import type { ExamsFilters } from '@/@types';
import { UITopbar } from '@/ui/components';
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
      <div className="shrink-0">
        <MaterialFilters form={filters} />
      </div>
      <MaterialTable rows={filtered} emptyCategory={tab === 'reviews' || tab === 'professors'} />
    </div>
  );
}
