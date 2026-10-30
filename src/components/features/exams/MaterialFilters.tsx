import { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import { EXAMSMOCKS } from '@/utils';
import type { ExamsFilters } from '@/@types';
import { UIButton, UISearch, UISegmented } from '@/ui/components';

export function MaterialFilters({ form }: { form: UseFormReturn<ExamsFilters> }) {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
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
      <div className="mb-5.5 flex flex-wrap items-center gap-2">
        <UISegmented
          label={t('exams.title')}
          options={tabs}
          value={tabs[tabIds.indexOf(tab ?? 'papers')]}
          onChange={(value) => form.setValue('tab', tabIds[tabs.indexOf(value)])}
        />
        <div className="flex-1" />
        <select
          className="app-control w-auto rounded-full text-label"
          aria-label={t('app.university')}
          {...form.register('university')}
        >
          <option value="">{t('app.allUniversities')}</option>
          {EXAMSMOCKS.universities.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
        <select
          className="app-control w-auto rounded-full text-label"
          aria-label={t('app.semester')}
        >
          <option>{EXAMSMOCKS.semester}</option>
        </select>
        <UIButton
          size="icon"
          bg="secondary"
          aria-label={t('topbar.search')}
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search size={16} />
        </UIButton>
      </div>
      {(searchOpen || search) && (
        <div className="mb-4">
          <UISearch
            value={search ?? ''}
            onChange={(search) => form.setValue('search', search)}
            label={t('app.searchMaterials')}
          />
        </div>
      )}
    </>
  );
}
