import { captureAnalytics } from '@/utils/analytics';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import type { Programme } from '@/@types';
import { useMyProgrammes, useProfileProgrammes, useUniversities } from '@/hooks';
import { programmeSchema, type ProgrammeFormSchema } from '@/schemas';
import { UIButton, UIField, UIPanel, UISelect, UIUnsavedChanges } from '@/ui/components';
import { AddProgramme } from './AddProgramme';

export function StudyProgrammes({ universityId }: { universityId: string }) {
  const { t } = useTranslation();
  const { data: universities } = useUniversities();
  const faculties = (
    universities?.find((university) => university.id === universityId)?.faculties ?? []
  ).map((faculty) => faculty.name);
  const { data: programmesData } = useMyProgrammes();
  const programmes = programmesData?.programmes ?? [];
  const { saveProgramme, isSaving, removeProgramme, isRemoving } = useProfileProgrammes();

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
  programme: Programme;
  faculties: string[];
  isPending: boolean;
  onSave: (programme: ProgrammeFormSchema) => Promise<Programme>;
  onRemove: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const {
    control,
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
      <form
        onSubmit={handleSubmit(save, () =>
          captureAnalytics('programme_update_form_validation_failed'),
        )}
      >
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
                    className="min-h-0 px-2 py-1 text-micro motion-safe:animate-pop-in"
                    disabled={isPending}
                  >
                    <Save size={12} />
                    {t('app.saveChanges')}
                  </UIButton>
                )}
              </div>
            </summary>
            <div className="grid gap-3 pt-3 [&_label>span]:text-[10px] [&_label>span]:font-bold [&_label>span]:tracking-[0.8px] [&_label>span]:text-muted [&_label>span]:uppercase">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_125px]">
                <UIField
                  label={t('app.faculty')}
                  error={errors.faculty ? t('app.required') : undefined}
                  className="rounded-lg bg-white-5 px-2.5 py-2"
                >
                  <Controller
                    control={control}
                    name="faculty"
                    render={({ field }) => (
                      <UISelect
                        label={t('app.faculty')}
                        value={field.value}
                        onChange={field.onChange}
                        className="text-detail"
                        options={[...new Set([programme.faculty, ...faculties])].map((faculty) => ({
                          value: faculty,
                          label: faculty,
                        }))}
                      />
                    )}
                  />
                </UIField>
                <UIField
                  label={t('app.yearOfStudy')}
                  error={errors.yearOfStudy ? t('app.required') : undefined}
                  className="rounded-lg bg-white-5 px-2.5 py-2"
                >
                  <Controller
                    control={control}
                    name="yearOfStudy"
                    render={({ field }) => (
                      <UISelect
                        label={t('app.yearOfStudy')}
                        value={field.value === null ? '' : String(field.value)}
                        onChange={(value) => field.onChange(value === '' ? null : Number(value))}
                        className="text-detail"
                        options={[
                          { value: '', label: '—' },
                          ...Array.from({ length: 10 }, (_, index) => ({
                            value: String(index + 1),
                            label: t('app.studyYear', { year: index + 1 }),
                          })),
                        ]}
                      />
                    )}
                  />
                </UIField>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <UIField label={t('app.studyStatus')} className="rounded-lg bg-white-5 px-2.5 py-2">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <UISelect
                        label={t('app.studyStatus')}
                        value={field.value}
                        onChange={field.onChange}
                        className="text-detail"
                        options={[
                          { value: 'active', label: t('app.studyStatusActive') },
                          { value: 'graduated', label: t('app.studyStatusGraduated') },
                          { value: 'suspended', label: t('app.studyStatusSuspended') },
                          { value: 'cancelled', label: t('app.studyStatusCancelled') },
                        ]}
                      />
                    )}
                  />
                </UIField>
                <UIField label={t('app.studyLevel')} className="rounded-lg bg-white-5 px-2.5 py-2">
                  <Controller
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <UISelect
                        label={t('app.studyLevel')}
                        value={field.value ?? ''}
                        onChange={(value) => field.onChange(value || null)}
                        className="text-detail"
                        options={[
                          { value: '', label: '—' },
                          { value: 'first_cycle', label: t('app.studyLevelFirstCycle') },
                          { value: 'second_cycle', label: t('app.studyLevelSecondCycle') },
                          { value: 'long_cycle', label: t('app.studyLevelLongCycle') },
                          { value: 'third_cycle', label: t('app.studyLevelThirdCycle') },
                          { value: 'phd_school', label: t('app.studyLevelPhdSchool') },
                        ]}
                      />
                    )}
                  />
                </UIField>
                <UIField
                  label={t('app.modeOfStudies')}
                  className="rounded-lg bg-white-5 px-2.5 py-2"
                >
                  <Controller
                    control={control}
                    name="modeOfStudies"
                    render={({ field }) => (
                      <UISelect
                        label={t('app.modeOfStudies')}
                        value={field.value ?? ''}
                        onChange={(value) => field.onChange(value || null)}
                        className="text-detail"
                        options={[
                          { value: '', label: '—' },
                          { value: 'full_time', label: t('app.modeOfStudiesFullTime') },
                          { value: 'part_time', label: t('app.modeOfStudiesPartTime') },
                        ]}
                      />
                    )}
                  />
                </UIField>
              </div>
            </div>
          </details>
        </fieldset>
      </form>
    </UIPanel>
  );
}
