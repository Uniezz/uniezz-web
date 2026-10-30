import { useTranslation } from 'react-i18next';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

import { EXAMSMOCKS } from '@/utils';
import type { ExamsFilters } from '@/@types';
import { UISearch, UISegmented } from '@/ui/components';

export function MaterialFilters({ form }: { form: UseFormReturn<ExamsFilters> }) {
  const { t } = useTranslation();
  const { search, tab } = useWatch({ control: form.control });
  const tabs: string[] = [
    t('app.pastPapers'),
    t('app.courseReviews'),
    t('app.professorRatings'),
    t('app.myUploads'),
  ];
  const tabIds = ['papers', 'reviews', 'professors', 'mine'];
  return (
    <>
      <div className="mb-4">
        <UISearch
          value={search ?? ''}
          onChange={(search) => form.setValue('search', search)}
          label={t('app.searchMaterials')}
        />
      </div>
      <div className="mb-5.5 flex flex-wrap items-center gap-2">
        <UISegmented
          label={t('exams.title')}
          options={tabs}
          value={tabs[tabIds.indexOf(tab ?? 'papers')]}
          onChange={(value) => form.setValue('tab', tabIds[tabs.indexOf(value)])}
        />
        <div className="flex-1" />
        <label className="relative inline-flex">
          <select
            className="app-control h-auto w-auto appearance-none rounded-full pr-11 text-label hover:border-white-40 focus:border-white-10 focus:hover:border-white-40"
            aria-label={t('app.university')}
            {...form.register('university')}
          >
            <option value="">{t('app.allUniversities')}</option>
            {EXAMSMOCKS.universities.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-white-80"
          />
        </label>
        <span
          aria-label={`${t('app.semester')}: ${EXAMSMOCKS.semester}`}
          className="inline-flex min-h-11 items-center rounded-full border border-white-10 bg-white-5 px-3 text-label"
        >
          {EXAMSMOCKS.semester}
        </span>
      </div>
    </>
  );
}
