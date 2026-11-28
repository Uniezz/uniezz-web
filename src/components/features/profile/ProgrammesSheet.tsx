import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Programme } from '@/@types';
import { useProfileProgrammes } from '@/hooks';
import { programmeSchema, type ProgrammeFormSchema } from '@/schemas';
import { cn } from '@/ui/cn';
import {
  UIButton,
  UIChip,
  UIDialog,
  UIField,
  UISegmented,
  UIUniversityLogo,
} from '@/ui/components';
import { apiErrorKey, captureAnalytics, toast } from '@/utils';
import { ProfileFormSheet } from './ProfileFormSheet';

export type ProgrammesSheetProps = {
  open: boolean;
  onClose: () => void;
  programmes: Programme[];
  /** Programmes have no university of their own; the profile's shows with each. */
  universityId: string;
};

const FORM_ID = 'programmes-sheet-form';
const STUDY_YEARS = ['1', '2', '3', '4', '5', '6'];
const STUDY_LEVELS = [
  ['first_cycle', 'app.studyLevelFirstCycle'],
  ['second_cycle', 'app.studyLevelSecondCycle'],
  ['long_cycle', 'app.studyLevelLongCycle'],
  ['third_cycle', 'app.studyLevelThirdCycle'],
  ['phd_school', 'app.studyLevelPhdSchool'],
] as const;
const STUDY_MODES = [
  ['full_time', 'app.modeOfStudiesFullTime'],
  ['part_time', 'app.modeOfStudiesPartTime'],
] as const;
const STUDY_STATUSES = [
  ['active', 'app.studyStatusActive'],
  ['graduated', 'app.studyStatusGraduated'],
  ['suspended', 'app.studyStatusSuspended'],
  ['cancelled', 'app.studyStatusCancelled'],
] as const;
const emptyProgramme: ProgrammeFormSchema = {
  programme: '',
  faculty: '',
  yearOfStudy: null,
  isPrimary: false,
  status: 'active',
  level: null,
  modeOfStudies: null,
};

/** The mobile app's ProgrammesSheet: pick a programme from the list to edit it, or add one. */
export function ProgrammesSheet({ open, onClose, programmes, universityId }: ProgrammesSheetProps) {
  const { t } = useTranslation();
  // null: the list; 'new': the add form; otherwise the edited programme's id
  const [selection, setSelection] = useState<string | null>(null);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const programme = programmes.find(({ id }) => id === selection);
  const isFormShown = selection !== null;
  const { saveProgramme, isSaving, removeProgramme, isRemoving } = useProfileProgrammes();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm<ProgrammeFormSchema>({
    resolver: zodResolver(programmeSchema),
    // follows the picked programme, so switching or reopening starts from it
    values: programme ?? emptyProgramme,
    mode: 'onChange',
  });
  const isPending = isSaving || isRemoving;

  const submit = handleSubmit(
    async (values) => {
      try {
        await saveProgramme(
          programme
            ? { programme: { ...values, isPrimary: programme.isPrimary }, id: programme.id }
            : // the first programme becomes primary
              { programme: { ...values, isPrimary: programmes.length === 0 } },
        );
        toast.success(t('app.saved'));
        setSelection(null);
      } catch (error) {
        toast.error(t(apiErrorKey(error, 'apiState.profileSaveError')));
      }
    },
    () =>
      captureAnalytics(
        programme
          ? 'programme_update_form_validation_failed'
          : 'programme_add_form_validation_failed',
      ),
  );
  const handleAdd = () => setSelection('new');
  const handleBack = () => {
    reset();
    setSelection(null);
  };
  // a closed sheet drops unsaved edits and opens on the list next time
  const handleClose = () => {
    reset();
    setSelection(null);
    onClose();
  };
  const handleMakePrimary = async () => {
    if (!programme) return;
    try {
      await saveProgramme({ programme: { ...programme, isPrimary: true }, id: programme.id });
      toast.success(t('app.saved'));
    } catch {
      toast.error(t('apiState.profileSaveError'));
    }
  };
  const handleRemoveOpen = () => setIsRemoveOpen(true);
  const handleRemoveCancel = () => setIsRemoveOpen(false);
  const handleRemove = async () => {
    if (!programme) return;
    try {
      await removeProgramme(programme.id);
      toast.success(t('app.saved'));
      setIsRemoveOpen(false);
      setSelection(null);
    } catch {
      toast.error(t('apiState.profileSaveError'));
    }
  };

  return (
    <>
      <ProfileFormSheet
        open={open}
        onClose={handleClose}
        title={t('study.programmes')}
        isDirty={isFormShown && isDirty && !isPending}
        actionLabel={programme ? t('app.save') : t('app.addProgramme')}
        isActionDisabled={isFormShown && (!isDirty || !isValid || isPending)}
        formId={isFormShown ? FORM_ID : undefined}
        onAction={isFormShown ? undefined : handleAdd}
        destructiveLabel={programme ? t('app.remove') : undefined}
        onDestructive={handleRemoveOpen}
        onBack={isFormShown ? handleBack : undefined}
      >
        {isFormShown ? (
          <form id={FORM_ID} onSubmit={(event) => void submit(event)} className="contents">
            <fieldset disabled={isPending} className="contents">
              <UIField label={t('app.programme')} error={errors.programme && t('app.required')}>
                <input
                  className="app-control"
                  autoComplete="off"
                  maxLength={120}
                  {...register('programme')}
                />
              </UIField>
              <UIField label={t('app.faculty')} error={errors.faculty && t('app.required')}>
                <input
                  className="app-control"
                  autoComplete="off"
                  maxLength={120}
                  {...register('faculty')}
                />
              </UIField>
              <Controller
                control={control}
                name="yearOfStudy"
                render={({ field }) => (
                  <Group label={t('app.yearOfStudy')}>
                    <UISegmented
                      label={t('app.yearOfStudy')}
                      options={STUDY_YEARS}
                      value={field.value === null ? '' : String(field.value)}
                      onChange={(value) => field.onChange(Number(value))}
                    />
                  </Group>
                )}
              />
              {(
                [
                  ['level', 'app.studyLevel', STUDY_LEVELS],
                  ['modeOfStudies', 'app.modeOfStudies', STUDY_MODES],
                  ['status', 'app.studyStatus', STUDY_STATUSES],
                ] as const
              ).map(([name, label, options]) => (
                <Controller
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Group label={t(label)}>
                      {/* chip rows run edge to edge, so chips scroll under the fades */}
                      <div className="-mx-4 flex [scrollbar-width:none] gap-1.5 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] px-4">
                        {options.map(([value, optionLabel]) => (
                          <UIChip
                            key={value}
                            selected={field.value === value}
                            onClick={() => field.onChange(value)}
                            data-ph-capture-attribute-label="Pick programme option"
                            className={cn(
                              'inline-flex shrink-0 px-3.5 py-1.75 text-detail font-semibold whitespace-nowrap',
                              field.value === value ? 'border-white' : 'text-white-80',
                            )}
                          >
                            {t(optionLabel)}
                          </UIChip>
                        ))}
                      </div>
                    </Group>
                  )}
                />
              ))}
              {programme && !programme.isPrimary && (
                <button
                  type="button"
                  onClick={() => void handleMakePrimary()}
                  data-ph-capture-attribute-label="Make programme primary"
                  className="self-start text-detail font-semibold text-sky"
                >
                  {t('app.makePrimary')}
                </button>
              )}
            </fieldset>
          </form>
        ) : (
          <ul className="flex flex-col gap-2">
            {programmes.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelection(item.id)}
                  data-ph-capture-attribute-label="Edit study programme"
                  className="flex w-full items-center gap-3 rounded-2xl border border-white-10 bg-white-3 p-4 text-left"
                >
                  <UIUniversityLogo universityId={universityId} size="sm" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.75">
                    {item.isPrimary && (
                      <span className="text-micro font-medium text-secondary">
                        {t('app.primary')}
                      </span>
                    )}
                    <span className="truncate text-body font-semibold">{item.programme}</span>
                    {item.faculty && (
                      <span className="truncate text-detail text-secondary">{item.faculty}</span>
                    )}
                  </span>
                  <ChevronRight size={16} aria-hidden="true" className="shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </ProfileFormSheet>
      <UIDialog
        open={isRemoveOpen}
        onOpenChange={setIsRemoveOpen}
        dismissible={!isRemoving}
        title={t('app.remove')}
        description={programme?.programme}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isRemoving} onClick={handleRemoveCancel}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isRemoving} onClick={() => void handleRemove()}>
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-1.5">
      <span className="text-micro font-semibold text-secondary">{label}</span>
      {children}
    </div>
  );
}
