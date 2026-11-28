import type { CreateCourseForm, CourseFormDialogProps } from '@/@types';
// ai-design-check-ignore-file use-shared-components -- UIField and app-control are the established shared form pattern for react-hook-form in this project.
import { useId, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame } from 'lucide-react';
import {
  useAddCourseFile,
  useCreateCourse,
  useDeleteCourse,
  usePhoneViewport,
  useUpdateCourse,
  useUniversities,
  useMyProfile,
  useUploadStudyMaterial,
} from '@/hooks';
import { createCourseFormSchema } from '@/schemas';
import { apiErrorKey, captureAnalytics, toast } from '@/utils';
import { canUploadCourseMaterial, courseFormDefaults, studyFileTypeLabels } from '@/utils';
import { cn } from '@/ui/cn';
import {
  UIButton,
  UIChip,
  UIDialog,
  UIDialogFooter,
  UIField,
  UISelect,
  UIUniversityLogo,
  UIUnsavedChanges,
} from '@/ui/components';
import { CourseMaterialsPicker } from './CourseMaterialsPicker';
import { RatingInput } from './RatingInput';

export function CourseFormDialog({ course, onClose, onDeleted }: CourseFormDialogProps) {
  // on a phone, the mobile app's CourseFormSheet: a bottom sheet of chip rows with the action pinned below
  const isPhone = usePhoneViewport();
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  const materialsInputId = useId();
  const formId = `${materialsInputId}-form`;
  const [isReadingMaterials, setIsReadingMaterials] = useState(false);
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const { data: me } = useMyProfile();
  const programmes = me?.programmes ?? [];
  const initialProgramme = programmes.find(({ isPrimary }) => isPrimary) ?? programmes[0];
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(initialProgramme?.id ?? '');
  const { mutateAsync: create, isPending: isCreating } = useCreateCourse();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateCourse();
  const { mutateAsync: upload, isPending: isUploading } = useUploadStudyMaterial();
  const { mutateAsync: attach, isPending: isAttaching } = useAddCourseFile();
  const isPending = isCreating || isUpdating || isUploading || isAttaching || isReadingMaterials;
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseFormSchema),
    defaultValues: course
      ? { ...course, materials: [], materialType: 'exam' }
      : courseFormDefaults(me),
  });
  const isSaving = isPending || isSubmitting || isDeleting;
  const handleOpenChange = (open: boolean) => {
    if (open) return;
    // a backdrop tap with unsaved edits asks first, as the app's sheet
    if (isPhone && isDirty) setIsDiscardOpen(true);
    else onClose();
  };
  const handleDiscard = () => {
    setIsDiscardOpen(false);
    onClose(true);
  };
  const handleKeepEditing = () => setIsDiscardOpen(false);
  const handleDeleteOpen = () => setIsDeleteOpen(true);
  const handleDeleteCancel = () => setIsDeleteOpen(false);
  const handleDelete = () =>
    course &&
    deleteCourse(course.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast.success(t('study.courseDeleted'));
        (onDeleted ?? onClose)(true);
      },
      onError: (error) => toast.error(t(apiErrorKey(error))),
    });
  async function submit(values: CreateCourseForm) {
    try {
      if (course) {
        await update({
          id: course.id,
          body: {
            name: values.name,
            description: values.description,
            difficulty: values.difficulty,
          },
        });
        toast.success(t('courses.saved'));
        onClose(true);
        return;
      }
      if (
        values.materials.length > 0 &&
        !canUploadCourseMaterial(me, {
          universityId: values.universityId,
          subject: values.subject,
          faculty: values.faculty,
        })
      ) {
        toast.error(t('courses.uploadEligibility'));
        return;
      }
      let uploaded: Awaited<ReturnType<typeof upload>>[] = [];
      if (values.materials.length > 0) {
        uploaded = await Promise.all(values.materials.map((file) => upload(file)));
      }
      const created = await create({
        name: values.name,
        description: values.description,
        difficulty: values.difficulty,
        universityId: values.universityId,
        faculty: values.faculty,
        subject: values.subject,
        semester: values.semester,
      });
      try {
        await Promise.all(
          uploaded.map(({ file, mediaId }) =>
            attach({
              courseId: created.id,
              body: {
                mediaId,
                title: file.name.length < 3 ? `${file.name} file` : file.name.slice(0, 150),
                type: values.materialType,
              },
            }),
          ),
        );
      } catch {
        toast.error(t('courses.materialAttachFailed'));
        onClose(true);
        return;
      }
      toast.success(t('courses.created'));
      onClose(true);
    } catch (error) {
      toast.error(t(apiErrorKey(error)));
    }
  }
  const materialTypes = (['exam', 'colloquium', 'lab', 'notes'] as const).map((type) => ({
    value: type,
    label: t(studyFileTypeLabels[type]),
  }));
  return (
    <>
      <UIDialog
        placement={isPhone ? 'bottom' : 'right'}
        className={isPhone ? 'flex flex-col px-4 pb-0' : 'max-lg:p-4'}
        open
        onOpenChange={handleOpenChange}
        dismissible={!isSaving}
        title={
          isPhone
            ? t(course ? 'study.editCourse' : 'study.addCourse')
            : t(course ? 'courses.edit' : 'courses.create')
        }
        description={isPhone ? undefined : t('courses.formDescription')}
        footer={
          isPhone ? (
            // pinned below the fields over a surface gradient, as the app's UIFormSheet
            <div className="sticky bottom-0 z-10 -mx-4 mt-2 flex gap-3 bg-linear-to-t from-surface from-70% to-surface/0 px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              {course && (
                <UIButton
                  bg="danger"
                  className="px-6"
                  disabled={isSaving}
                  onClick={handleDeleteOpen}
                >
                  {t('app.remove')}
                </UIButton>
              )}
              <UIButton
                type="submit"
                form={formId}
                disabled={isSaving || (course && !course.isMine)}
                aria-busy={isSaving}
                className="flex-1"
              >
                {t(course ? 'app.save' : 'study.create')}
              </UIButton>
            </div>
          ) : (
            <UIDialogFooter>
              <UIButton
                bg="secondary"
                className="max-lg:hidden"
                onClick={() => onClose()}
                disabled={isSaving}
              >
                {t('app.cancel')}
              </UIButton>
              <UIButton
                type="submit"
                form={formId}
                disabled={isSaving || (course && !course.isMine)}
                aria-busy={isSaving}
                className="max-lg:flex-1"
              >
                {t('app.save')}
              </UIButton>
            </UIDialogFooter>
          )
        }
      >
        <UIUnsavedChanges dirty={isDirty} />
        <form
          id={formId}
          className="flex min-h-0 flex-1 flex-col gap-4"
          onSubmit={handleSubmit(submit, () => {
            captureAnalytics('course_form_validation_failed');
            // the app shows each field's error under it, without a toast
            if (!isPhone) toast.error(t('courses.validationError'));
          })}
        >
          <fieldset
            disabled={isSaving}
            className="scrollbar-hidden min-h-0 flex-1 space-y-4 overflow-y-auto max-lg:space-y-3.5"
          >
            {!course && (
              <fieldset
                className="flex min-w-0 flex-col gap-1.5 text-micro font-semibold text-secondary"
                aria-describedby={`${materialsInputId}-hint`}
              >
                <legend>{t('courses.materials')}</legend>
                <Controller
                  name="materials"
                  control={control}
                  render={({ field: { value } }) => (
                    <CourseMaterialsPicker
                      appearance={isPhone ? 'rows' : 'tiles'}
                      files={value}
                      disabled={isSaving}
                      onReadingChange={setIsReadingMaterials}
                      onFilesChange={(nextFiles) =>
                        setValue('materials', nextFiles, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      {!isPhone && (
                        <Controller
                          name="materialType"
                          control={control}
                          render={({ field }) => (
                            <UISelect
                              label={t('courses.materialType')}
                              className="app-control"
                              value={field.value}
                              onChange={field.onChange}
                              options={materialTypes}
                            />
                          )}
                        />
                      )}
                    </CourseMaterialsPicker>
                  )}
                />
                <p
                  id={`${materialsInputId}-hint`}
                  role={errors.materials ? 'alert' : undefined}
                  className={
                    errors.materials ? 'font-medium text-warning' : 'font-medium text-muted'
                  }
                >
                  {t('courses.materialsHint')}
                </p>
              </fieldset>
            )}
            {!course && isPhone && (
              <Controller
                name="materialType"
                control={control}
                render={({ field }) => (
                  <ChipRow label={t('study.materialType')}>
                    {materialTypes.map(({ value, label }) => (
                      <SheetChip
                        key={value}
                        selected={field.value === value}
                        onClick={() => field.onChange(value)}
                      >
                        {label}
                      </SheetChip>
                    ))}
                  </ChipRow>
                )}
              />
            )}
            <UIField
              label={t('courses.name')}
              error={errors.name ? t('courses.nameHint') : undefined}
            >
              <input
                className="app-control"
                autoComplete="off"
                maxLength={150}
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
            </UIField>
            <UIField
              label={t('courses.description')}
              error={errors.description ? t('courses.descriptionHint') : undefined}
            >
              <textarea
                // on a phone, a fixed box that scrolls inside, as in the app
                className="app-control max-h-50 min-h-28 resize-y max-lg:h-37.5 max-lg:max-h-none max-lg:min-h-0 max-lg:resize-none"
                maxLength={5000}
                aria-invalid={Boolean(errors.description)}
                {...register('description')}
              />
            </UIField>
            <UIField
              labelAs={isPhone ? 'div' : 'label'}
              label={isPhone ? t('study.difficulty') : t('courses.difficulty')}
              error={errors.difficulty ? t('courses.difficultyHint') : undefined}
            >
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <RatingInput
                    average={field.value}
                    count={0}
                    myRating={field.value}
                    analyticsLabel="Set course difficulty"
                    ariaLabel={t('courses.difficulty')}
                    showSummary={false}
                    size={isPhone ? 'large' : undefined}
                    icon={Flame}
                    onRate={field.onChange}
                  />
                )}
              />
            </UIField>
            {!course && (
              <>
                <div className="flex flex-col gap-1.5 text-micro font-semibold text-secondary">
                  <span>{t('app.university')}</span>
                  <div className="flex min-h-8 min-w-0 items-center gap-2 text-label font-normal text-white-80">
                    {me?.universityId && <UIUniversityLogo universityId={me.universityId} />}
                    <span className="min-w-0 wrap-anywhere">
                      {universities.find(({ id }) => id === me?.universityId)?.name ??
                        me?.universityId}
                    </span>
                  </div>
                  <input type="hidden" {...register('universityId')} />
                  {errors.universityId && (
                    <span role="alert" className="font-medium text-warning">
                      {t('app.required')}
                    </span>
                  )}
                </div>
                {programmes.length > 1 && isPhone && (
                  <ChipRow label={t('study.programmes')}>
                    {programmes.map((programme) => (
                      <SheetChip
                        key={programme.id}
                        selected={selectedProgrammeId === programme.id}
                        onClick={() => {
                          setSelectedProgrammeId(programme.id);
                          setValue('faculty', programme.faculty, { shouldDirty: true });
                        }}
                      >
                        {programme.programme}
                      </SheetChip>
                    ))}
                  </ChipRow>
                )}
                {programmes.length > 1 && !isPhone && (
                  <UIField label={t('app.studyProgrammes')}>
                    <UISelect
                      label={t('app.studyProgrammes')}
                      className="app-control"
                      value={selectedProgrammeId}
                      options={programmes.map((programme) => ({
                        value: programme.id,
                        label: `${programme.programme} · ${programme.faculty}`,
                      }))}
                      onChange={(id) => {
                        const programme = programmes.find((item) => item.id === id);
                        if (!programme) return;
                        setSelectedProgrammeId(programme.id);
                        setValue('faculty', programme.faculty, { shouldDirty: true });
                      }}
                    />
                  </UIField>
                )}
                <UIField
                  label={t('app.faculty')}
                  error={errors.faculty ? t('courses.nameHint') : undefined}
                >
                  <input className="app-control" readOnly {...register('faculty')} />
                </UIField>
                <UIField
                  label={t('app.programme')}
                  error={errors.subject ? t('courses.subjectHint') : undefined}
                >
                  <input
                    className="app-control"
                    maxLength={150}
                    placeholder={t('courses.subjectPlaceholder')}
                    {...register('subject')}
                  />
                </UIField>
                <UIField
                  labelAs={isPhone ? 'div' : 'label'}
                  label={t('app.semester')}
                  error={errors.semester ? t('courses.semesterHint') : undefined}
                >
                  <Controller
                    name="semester"
                    control={control}
                    render={({ field }) =>
                      isPhone ? (
                        <div className="-mx-4 scrollbar-hidden flex gap-1.5 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] px-4">
                          {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
                            <SheetChip
                              key={value}
                              selected={field.value === value}
                              onClick={() => field.onChange(value)}
                            >
                              {value}
                            </SheetChip>
                          ))}
                        </div>
                      ) : (
                        <UISelect
                          label={t('app.semester')}
                          className="app-control"
                          value={String(field.value)}
                          onChange={(value) => field.onChange(Number(value))}
                          options={Array.from({ length: 12 }, (_, index) => index + 1).map(
                            (value) => ({
                              value: String(value),
                              label: t('exams.semesterNumber', { semester: value }),
                            }),
                          )}
                        />
                      )
                    }
                  />
                </UIField>
              </>
            )}
          </fieldset>
        </form>
      </UIDialog>
      <UIDialog
        open={isDiscardOpen}
        onOpenChange={setIsDiscardOpen}
        title={t('app.unsavedChangesTitle')}
        description={t('study.discardChangesDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" onClick={handleKeepEditing}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" onClick={handleDiscard}>
            {t('study.discard')}
          </UIButton>
        </div>
      </UIDialog>
      <UIDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        dismissible={!isDeleting}
        title={t('study.deleteCourseTitle')}
        description={t('study.deleteCourseDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={handleDeleteCancel}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isDeleting} onClick={handleDelete}>
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}

/** A labelled row of sheet chips that bleeds to the sheet edges and scrolls sideways. */
function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-1.5">
      <span className="text-micro font-semibold text-secondary">{label}</span>
      <div className="-mx-4 scrollbar-hidden flex gap-1.5 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] px-4">
        {children}
      </div>
    </div>
  );
}

function SheetChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <UIChip
      selected={selected}
      onClick={onClick}
      data-ph-capture-attribute-label="Pick course form option"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 px-3.5 py-1.75 text-detail font-semibold whitespace-nowrap',
        selected ? 'border-white' : 'text-white-80',
      )}
    >
      {children}
    </UIChip>
  );
}
