import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import type { components } from '@/@types/schema';
import { useMyProfile, useProfileProgrammes, useUniversities } from '@/hooks';
import { programmeSchema, type ProgrammeFormSchema } from '@/schemas';
import { UIButton, UIField, UIPanel, UIUnsavedChanges } from '@/ui/components';
import { AddProgramme } from './AddProgramme';

export function StudyProgrammes({ universityId }: { universityId: string }) {
  const { t } = useTranslation();
  const { data: universities } = useUniversities();
  const faculties =
    universities?.find((university) => university.id === universityId)?.faculties ?? [];
  const { data: profile } = useMyProfile();
  const { saveProgramme, isSaving, removeProgramme, isRemoving } = useProfileProgrammes();
  const programmes = profile?.programmes ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold">{t('app.studyProgrammes')}</h2>
        <AddProgramme programmes={programmes} />
      </div>
      {programmes.map((programme) => (
        <ProgrammeCard
          key={programme.id}
          programme={programme}
          faculties={faculties.map((faculty) => faculty.name)}
          isPending={isSaving || isRemoving}
          onSave={(values) => saveProgramme({ programme: values, id: programme.id })}
          onRemove={() => removeProgramme(programme.id)}
        />
      ))}
    </div>
  );
}

function ProgrammeCard({
  programme,
  faculties,
  isPending,
  onSave,
  onRemove,
}: {
  programme: components['schemas']['Programme'];
  faculties: string[];
  isPending: boolean;
  onSave: (programme: ProgrammeFormSchema) => Promise<components['schemas']['Programme']>;
  onRemove: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty: formIsDirty, dirtyFields },
  } = useForm<ProgrammeFormSchema>({
    resolver: zodResolver(programmeSchema),
    values: programme,
    resetOptions: { keepDirtyValues: true },
  });
  const isDirty = formIsDirty || Object.keys(dirtyFields).length > 0;

  async function save(values: ProgrammeFormSchema) {
    try {
      reset(await onSave(values));
    } catch {
      toast.error(t('apiState.profileSaveError'));
    }
  }

  async function makePrimary() {
    await save({ ...getValues(), isPrimary: true });
  }

  async function removeProgramme() {
    try {
      await onRemove();
    } catch {
      toast.error(t('apiState.profileSaveError'));
    }
  }

  return (
    <UIPanel surface="tint" className="rounded-programme p-4">
      <UIUnsavedChanges dirty={isDirty} />
      <form onSubmit={handleSubmit(save)}>
        <fieldset disabled={isPending}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-section font-bold">{programme.programme}</h3>
            <div className="flex items-center gap-2">
              {programme.isPrimary ? (
                <span className="px-2 py-1 text-micro font-semibold">{t('app.primary')}</span>
              ) : (
                <UIButton
                  size="pill"
                  bg="transparent"
                  className="min-h-0 px-2 py-1 text-micro"
                  disabled={isPending}
                  onClick={() => void makePrimary()}
                >
                  {t('app.makePrimary')}
                </UIButton>
              )}
              {!programme.isPrimary && (
                <UIButton
                  size="pill"
                  bg="transparent"
                  className="min-h-0 px-2 py-1 text-micro"
                  disabled={isPending}
                  onClick={() => void removeProgramme()}
                >
                  <Trash2 size={12} />
                  {t('app.remove')}
                </UIButton>
              )}
              <UIButton type="submit" size="sm" bg="secondary" disabled={isPending || !isDirty}>
                {t('app.saveChanges')}
              </UIButton>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_125px] [&_label>span]:text-[10px] [&_label>span]:font-bold [&_label>span]:tracking-[0.8px] [&_label>span]:text-muted [&_label>span]:uppercase [&_select]:min-h-0 [&_select]:rounded-none [&_select]:border-0 [&_select]:bg-transparent [&_select]:p-0 [&_select]:text-detail">
            <UIField
              label={t('app.faculty')}
              error={errors.faculty ? t('app.required') : undefined}
              className="rounded-lg bg-white-5 px-2.5 py-2"
            >
              <select className="app-control" {...register('faculty')} required>
                {[...new Set([programme.faculty, ...faculties])].map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </UIField>
            <UIField
              label={t('app.yearOfStudy')}
              error={errors.yearOfStudy ? t('app.required') : undefined}
              className="rounded-lg bg-white-5 px-2.5 py-2"
            >
              <select
                className="app-control"
                {...register('yearOfStudy', {
                  setValueAs: (value) => (value === '' || value === null ? null : Number(value)),
                })}
              >
                <option value="">—</option>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((year) => (
                  <option key={year} value={year}>
                    {t('app.studyYear', { year })}
                  </option>
                ))}
              </select>
            </UIField>
          </div>
        </fieldset>
      </form>
    </UIPanel>
  );
}
