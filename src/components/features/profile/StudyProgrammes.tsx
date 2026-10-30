import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Trash2 } from 'lucide-react';

// TODO(api): Replace the mock faculty option with profile/catalog API data.
import { PROFILEMOCKS } from '@/utils';
import { UIButton, UIField, UIPanel } from '@/ui/components';
import { type ProfileFormSchema } from '@/schemas';
import { AddProgramme } from './AddProgramme';

export function StudyProgrammes() {
  const { t } = useTranslation();
  const { control, register, setValue } = useFormContext<ProfileFormSchema>();
  const { fields, append, remove } = useFieldArray({ control, name: 'programmes' });
  const programmes = useWatch({ control, name: 'programmes' });
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold">{t('app.studyProgrammes')}</h2>
        <AddProgramme
          programmes={programmes}
          onAdd={(programme) => append({ ...programme, primary: fields.length === 0 })}
        />
      </div>
      {programmes.map((programme, i) => (
        <UIPanel key={fields[i].id} surface="tint" className="rounded-programme p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-section font-bold">{programme.name}</h3>
            <div className="flex items-center gap-2">
              <UIButton
                size="pill"
                bg="transparent"
                className="min-h-0 px-2 py-1 text-micro"
                aria-pressed={programme.primary}
                onClick={() =>
                  programmes.forEach((_, j) =>
                    setValue(`programmes.${j}.primary`, i === j, { shouldDirty: true }),
                  )
                }
              >
                {programme.primary ? t('app.primary') : t('app.makePrimary')}
              </UIButton>
              {!programme.primary && (
                <UIButton
                  size="pill"
                  bg="transparent"
                  className="min-h-0 px-2 py-1 text-micro"
                  onClick={() => remove(i)}
                >
                  <Trash2 size={12} />
                  {t('app.remove')}
                </UIButton>
              )}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_125px] [&_label>span]:text-[10px] [&_label>span]:font-bold [&_label>span]:tracking-[0.8px] [&_label>span]:text-muted [&_label>span]:uppercase [&_select]:min-h-0 [&_select]:rounded-none [&_select]:border-0 [&_select]:bg-transparent [&_select]:p-0 [&_select]:text-detail">
            <UIField label={t('app.faculty')} className="rounded-lg bg-white-5 px-2.5 py-2">
              <select className="app-control" {...register(`programmes.${i}.faculty`)}>
                <option>{PROFILEMOCKS.faculty}</option>
              </select>
            </UIField>
            <UIField label={t('app.yearOfStudy')} className="rounded-lg bg-white-5 px-2.5 py-2">
              <select className="app-control" {...register(`programmes.${i}.year`)}>
                {['1', '2', '3', '4'].map((year) => (
                  <option key={year} value={year}>
                    {t('app.studyYear', { year })}
                  </option>
                ))}
              </select>
            </UIField>
          </div>
        </UIPanel>
      ))}
    </>
  );
}
