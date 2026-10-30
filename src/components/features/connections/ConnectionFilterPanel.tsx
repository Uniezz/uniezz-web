import { useState } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CONNECTIONSMOCKS } from '@/utils';
import type { ConnectionFilters } from '@/@types';
import { UIButton, UIChip, UIDialog, UIPanel } from '@/ui/components';

export function ConnectionFilterPanel({ form }: { form: UseFormReturn<ConnectionFilters> }) {
  const { t } = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);
  const { universities = [], years } = useWatch({ control: form.control });
  return (
    <>
      <UIPanel>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-section font-semibold">{t('app.showing')}</h2>
          <UIButton size="pill" bg="transparent" onClick={() => setFilterOpen(true)}>
            {t('app.edit')}
          </UIButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {universities.map((u) => (
            <span className="app-tag" key={u}>
              {u}
            </span>
          ))}
          {years && <span className="app-tag">{CONNECTIONSMOCKS.year}</span>}
        </div>
      </UIPanel>
      <UIDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title={t('connections.action')}
        description={t('app.localOnly')}
      >
        <div className="flex flex-wrap gap-3">
          {['UMCS', 'KUL', 'Politechnika'].map((u) => (
            <UIChip
              key={u}
              selected={universities.includes(u)}
              onClick={() =>
                form.setValue(
                  'universities',
                  universities.includes(u)
                    ? universities.filter((v) => v !== u)
                    : [...universities, u],
                )
              }
            >
              {u}
            </UIChip>
          ))}
          <UIChip selected={years} onClick={() => form.setValue('years', !years)}>
            {CONNECTIONSMOCKS.year}
          </UIChip>
        </div>
        <UIButton className="mt-6" onClick={() => setFilterOpen(false)}>
          {t('app.done')}
        </UIButton>
      </UIDialog>
    </>
  );
}
