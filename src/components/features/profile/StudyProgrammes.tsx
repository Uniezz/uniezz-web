import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import type { components } from '@/@types/schema';
import { useMyProfile, useProfileProgrammes, useUniversities } from '@/hooks';
import { programmeSchema, type ProgrammeFormSchema } from '@/schemas';
import { UIButton, UIField, UIPanel, UIUnsavedChanges } from '@/ui/components';
import { AddProgramme } from './AddProgramme';

export function StudyProgrammes({
  universityId,
  initialProgrammes,
}: {
  universityId: string;
  initialProgrammes: components['schemas']['Programme'][];
}) {
  const { t } = useTranslation();
  const { data: universities } = useUniversities();
  const faculties = (
    universities?.find((university) => university.id === universityId)?.faculties ?? []
  ).map((faculty) => faculty.name);
  const { data: profile } = useMyProfile();
  const { saveProgramme, isSaving, removeProgramme, isRemoving } = useProfileProgrammes();
  const programmes = profile?.programmes ?? initialProgrammes;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold">{t('app.studyProgrammes')}</h2>
        <AddProgramme programmes={programmes} faculties={faculties} />
      </div>
      {programmes.map((programme) => (
        <ProgrammeCard
          key={programme.id}
          programme={programme}
          faculties={faculties}
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
      // reset() merges resetOptions; without this, saved fields stay in dirtyFields
      reset(await onSave(values), { keepDirtyValues: false });
      toast.success(t('app.saved'));
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
          <details className="group [interpolate-size:allow-keywords] details-content:h-0 details-content:overflow-hidden details-content:transition-[height,content-visibility] details-content:transition-discrete details-content:duration-200 open:details-content:h-auto motion-reduce:details-content:transition-none">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <h3 className="flex min-w-0 flex-1 items-center gap-2 text-section font-bold">
                {programme.programme}
                <ChevronDown
                  size={16}
                  className="shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </h3>
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
                {isDirty && (
                  <UIButton
                    type="submit"
                    size="pill"
                    bg="secondary"
                    className="min-h-0 px-2 py-1 text-micro"
                    disabled={isPending}
                  >
                    <Save size={12} />
                    {t('app.saveChanges')}
                  </UIButton>
                )}
              </div>
            </summary>
            <div className="grid gap-3 pt-3 [&_label>span]:text-[10px] [&_label>span]:font-bold [&_label>span]:tracking-[0.8px] [&_label>span]:text-muted [&_label>span]:uppercase [&_select]:min-h-0 [&_select]:rounded-none [&_select]:border-0 [&_select]:bg-transparent [&_select]:p-0 [&_select]:text-detail">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_125px]">
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
                      setValueAs: (value) =>
                        value === '' || value === null ? null : Number(value),
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
              <div className="grid gap-3 sm:grid-cols-3">
                <UIField label={t('app.studyStatus')} className="rounded-lg bg-white-5 px-2.5 py-2">
                  <select className="app-control" {...register('status')}>
                    <option value="active">{t('app.studyStatusActive')}</option>
                    <option value="graduated">{t('app.studyStatusGraduated')}</option>
                    <option value="suspended">{t('app.studyStatusSuspended')}</option>
                    <option value="cancelled">{t('app.studyStatusCancelled')}</option>
                  </select>
                </UIField>
                <UIField label={t('app.studyLevel')} className="rounded-lg bg-white-5 px-2.5 py-2">
                  <select
                    className="app-control"
                    {...register('level', { setValueAs: (value) => value || null })}
                  >
                    <option value="">—</option>
                    <option value="first_cycle">{t('app.studyLevelFirstCycle')}</option>
                    <option value="second_cycle">{t('app.studyLevelSecondCycle')}</option>
                    <option value="long_cycle">{t('app.studyLevelLongCycle')}</option>
                    <option value="third_cycle">{t('app.studyLevelThirdCycle')}</option>
                    <option value="phd_school">{t('app.studyLevelPhdSchool')}</option>
                  </select>
                </UIField>
                <UIField
                  label={t('app.modeOfStudies')}
                  className="rounded-lg bg-white-5 px-2.5 py-2"
                >
                  <select
                    className="app-control"
                    {...register('modeOfStudies', { setValueAs: (value) => value || null })}
                  >
                    <option value="">—</option>
                    <option value="full_time">{t('app.modeOfStudiesFullTime')}</option>
                    <option value="part_time">{t('app.modeOfStudiesPartTime')}</option>
                  </select>
                </UIField>
              </div>
            </div>
          </details>
        </fieldset>
      </form>
    </UIPanel>
  );
}
