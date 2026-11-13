import { captureAnalytics } from '@/utils';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

import type { Programme } from '@/@types';
import { useMyProgrammes, useProfileProgrammes, useUniversities } from '@/hooks';
import { programmeSchema, type ProgrammeFormSchema } from '@/schemas';
import {
  UIButton,
  UIDialog,
  UIDialogFooter,
  UIField,
  UIPanel,
  UISelect,
  UIUnsavedChanges,
} from '@/ui/components';
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-md font-bold">{t('app.studyProgrammes')}</h2>
        <AddProgramme programmes={programmes} faculties={faculties} />
      </div>
      <div className="max-h-72 space-y-4 overflow-y-auto">
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
  const [open, setOpen] = useState(false);
  const formId = useId();
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
      setOpen(false);
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
      setOpen(false);
    } catch {
      toast.error(t('apiState.profileSaveError'));
    }
  }

  function closeEditor() {
    reset(programme, { keepDirtyValues: false });
    setOpen(false);
  }

  return (
    <>
      <UIPanel
        surface="tint"
        className="relative flex min-w-0 items-center gap-2 rounded-programme p-4"
      >
        <button
          type="button"
          data-ph-capture-attribute-label="Edit study programme"
          aria-label={`${t('app.edit')} ${programme.programme}`}
          className="absolute inset-0 cursor-pointer rounded-programme focus-visible:outline-2 focus-visible:outline-blue enabled:hover:bg-white-5 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isPending}
          onClick={() => setOpen(true)}
        />
        <h3 className="pointer-events-none min-w-0 flex-1 text-section font-bold wrap-anywhere">
          {programme.programme}
        </h3>
        {programme.isPrimary && (
          <span className="pointer-events-none px-2 py-1 text-micro font-semibold">
            {t('app.primary')}
          </span>
        )}
      </UIPanel>
      <UIDialog
        placement="right"
        open={open}
        onOpenChange={(next) => {
          if (!next) closeEditor();
        }}
        dismissible={!isPending}
        title={programme.programme}
        description={t('app.studyProgrammes')}
        footer={
          <UIDialogFooter className="justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {!programme.isPrimary && (
                <>
                  <UIButton
                    bg="transparent"
                    size="pill"
                    disabled={isPending}
                    className="text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
                    onClick={() => void makePrimary()}
                  >
                    <Check size={16} aria-hidden="true" />
                    {t('app.makePrimary')}
                  </UIButton>
                  <UIButton
                    bg="transparent"
                    size="pill"
                    disabled={isPending}
                    className="text-danger enabled:hover:bg-transparent enabled:hover:text-danger-hover"
                    onClick={() => void removeProgramme()}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    {t('app.remove')}
                  </UIButton>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isDirty && (
                <>
                  <UIButton
                    bg="transparent"
                    size="pill"
                    disabled={isPending}
                    className="text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
                    onClick={closeEditor}
                  >
                    <X size={16} aria-hidden="true" />
                    {t('app.cancel')}
                  </UIButton>
                  <UIButton
                    type="submit"
                    form={formId}
                    bg="transparent"
                    size="pill"
                    disabled={isPending}
                    className="text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
                  >
                    <Check size={16} aria-hidden="true" />
                    {t('app.saveChanges')}
                  </UIButton>
                </>
              )}
            </div>
          </UIDialogFooter>
        }
      >
        <UIUnsavedChanges dirty={open && isDirty} />
        <form
          id={formId}
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit(save, () =>
            captureAnalytics('programme_update_form_validation_failed'),
          )}
        >
          <fieldset
            disabled={isPending}
            className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto"
          >
            <div className="grid gap-3 [&_label>span]:text-[10px] [&_label>span]:font-bold [&_label>span]:tracking-[0.8px] [&_label>span]:text-muted [&_label>span]:uppercase">
              <div className="grid gap-3">
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
                          ...Array.from({ length: 6 }, (_, index) => ({
                            value: String(index + 1),
                            label: t('app.studyYear', { year: index + 1 }),
                          })),
                        ]}
                      />
                    )}
                  />
                </UIField>
              </div>
              <div className="grid gap-3">
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
          </fieldset>
        </form>
      </UIDialog>
    </>
  );
}
