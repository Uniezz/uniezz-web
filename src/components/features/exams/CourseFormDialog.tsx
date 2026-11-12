import type { CreateCourseForm, CourseFormDialogProps } from '@/@types';
// ai-design-check-ignore-file use-shared-components -- UIField and app-control are the established shared form pattern for react-hook-form in this project.
import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useAddCourseFile,
  useCreateCourse,
  useUpdateCourse,
  useUniversities,
  useMyProfile,
  useUploadStudyMaterial,
} from '@/hooks';
import { createCourseFormSchema } from '@/schemas';
import { captureAnalytics } from '@/utils/analytics';
import { readImageFile } from '@/utils/image';
import { canUploadCourseMaterial, courseFormDefaults, studyFileTypeLabels } from '@/utils/exams';
import { UIButton, UIDialog, UIField, UIUniversityLogo, UIUnsavedChanges } from '@/ui/components';
import { CourseMaterialPreview, courseMaterialKey } from './CourseMaterialPreview';
import { RatingInput } from './RatingInput';

export function CourseFormDialog({ course, onClose }: CourseFormDialogProps) {
  const materialsInputId = useId();
  const [materialPreviews, setMaterialPreviews] = useState<{ key: string; src: string }[]>([]);
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
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseFormSchema),
    defaultValues: course
      ? { ...course, materials: [], materialType: 'exam' }
      : courseFormDefaults(me),
  });
  const isSaving = isPending || isSubmitting;
  const removeMaterial = useCallback(
    (key: string) => {
      setValue(
        'materials',
        getValues('materials').filter((file) => courseMaterialKey(file) !== key),
        { shouldDirty: true, shouldTouch: true, shouldValidate: true },
      );
      setMaterialPreviews((previous) => previous.filter((item) => item.key !== key));
    },
    [getValues, setValue],
  );
  async function submit(values: CreateCourseForm) {
    let progressToastId: string | undefined;
    function showProgress(message: string) {
      progressToastId = toast.loading(message, { id: progressToastId });
    }
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
        showProgress(t('courses.uploadingMaterials'));
        uploaded = await Promise.all(values.materials.map((file) => upload(file)));
      }
      showProgress(t('courses.creatingCourse'));
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
        toast.error(t('courses.materialAttachFailed'), { id: progressToastId });
        onClose(true);
        return;
      }
      toast.success(t('courses.created'), { id: progressToastId });
      onClose(true);
    } catch {
      toast.error(t('apiState.error'), { id: progressToastId });
    }
  }
  return (
    <UIDialog
      placement="right"
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      dismissible={!isSaving}
      title={t(course ? 'courses.edit' : 'courses.create')}
      description={t('courses.formDescription')}
    >
      <UIUnsavedChanges dirty={isDirty} />
      <form
        className="space-y-4"
        onSubmit={handleSubmit(submit, () => {
          captureAnalytics('course_form_validation_failed');
          toast.error(t('courses.validationError'));
        })}
      >
        <fieldset disabled={isSaving} className="space-y-4">
          {!course && (
            <UIField
              label={t('courses.materials')}
              hint={t('courses.materialsHint')}
              error={errors.materials ? t('courses.materialsHint') : undefined}
            >
              <Controller
                name="materials"
                control={control}
                render={({ field: { value, onChange, ...field } }) => {
                  async function addMaterials(files: File[]) {
                    const selectedKeys = new Set(value.map(courseMaterialKey));
                    const added = files.filter((file) => {
                      const key = courseMaterialKey(file);
                      if (selectedKeys.has(key)) return false;
                      selectedKeys.add(key);
                      return true;
                    });
                    if (!added.length) return;

                    setIsReadingMaterials(true);
                    try {
                      const previews = await Promise.all(
                        added
                          .filter((file) => file.type.startsWith('image/'))
                          .map(async (file) => ({
                            key: courseMaterialKey(file),
                            src: await readImageFile(file),
                          })),
                      );
                      setMaterialPreviews((previous) => [...previous, ...previews]);
                      onChange([...value, ...added]);
                    } catch {
                      toast.error(t('courses.fileHint'));
                    } finally {
                      setIsReadingMaterials(false);
                    }
                  }

                  return (
                    <>
                      <div className="grid grid-cols-[minmax(0,1fr)_minmax(8rem,0.55fr)] gap-3">
                        <div>
                          <input
                            {...field}
                            id={materialsInputId}
                            type="file"
                            multiple
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            className="peer sr-only"
                            disabled={isPending}
                            data-ph-capture-attribute-label="Choose course materials"
                            onChange={(event) => {
                              const files = Array.from(event.target.files ?? []);
                              event.currentTarget.value = '';
                              void addMaterials(files);
                            }}
                          />
                          <label
                            htmlFor={materialsInputId}
                            className="app-control flex cursor-pointer items-center justify-between gap-3 peer-focus-visible:outline-2 peer-focus-visible:outline-blue hover:bg-white-5"
                          >
                            <span>{t('courses.chooseFiles')}</span>
                            <Upload size={18} aria-hidden="true" />
                          </label>
                        </div>
                        <select
                          className="app-control"
                          aria-label={t('courses.materialType')}
                          data-ph-capture-attribute-label="Course material type"
                          {...register('materialType')}
                        >
                          {(['exam', 'colloquium', 'lab', 'notes'] as const).map((type) => (
                            <option key={type} value={type}>
                              {t(studyFileTypeLabels[type])}
                            </option>
                          ))}
                        </select>
                      </div>
                      {value.length > 0 && (
                        <div
                          role="region"
                          aria-label={t('courses.materials')}
                          tabIndex={0}
                          className="mt-3 flex h-38 max-w-full min-w-0 items-start gap-3 overflow-x-auto overflow-y-hidden rounded-feature [overflow-anchor:none] focus-visible:outline-2 focus-visible:outline-blue"
                        >
                          {value.map((file) => (
                            <CourseMaterialPreview
                              key={courseMaterialKey(file)}
                              file={file}
                              preview={
                                materialPreviews.find(
                                  (item) => item.key === courseMaterialKey(file),
                                )?.src
                              }
                              removeLabel={t('courses.removeMaterial')}
                              onRemove={removeMaterial}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </UIField>
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
              className="app-control max-h-100 min-h-28 resize-y"
              maxLength={5000}
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
          </UIField>
          <UIField
            label={t('courses.difficulty')}
            error={errors.difficulty ? t('courses.difficultyHint') : undefined}
          >
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <RatingInput
                  average={field.value}
                  count={0}
                  analyticsLabel="Set course difficulty"
                  ariaLabel={t('courses.difficulty')}
                  showSummary={false}
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
              {programmes.length > 1 && (
                <UIField label={t('app.studyProgrammes')}>
                  <select
                    className="app-control"
                    value={selectedProgrammeId}
                    data-ph-capture-attribute-label="Choose course study programme"
                    onChange={(event) => {
                      const programme = programmes.find(({ id }) => id === event.target.value);
                      if (!programme) return;
                      setSelectedProgrammeId(programme.id);
                      setValue('faculty', programme.faculty, { shouldDirty: true });
                      setValue('subject', programme.programme, { shouldDirty: true });
                    }}
                  >
                    {programmes.map((programme) => (
                      <option key={programme.id} value={programme.id}>
                        {programme.programme} · {programme.faculty}
                      </option>
                    ))}
                  </select>
                </UIField>
              )}
              <UIField
                label={t('app.faculty')}
                error={errors.faculty ? t('courses.nameHint') : undefined}
              >
                <input className="app-control" readOnly {...register('faculty')} />
              </UIField>
              <UIField
                label={t('app.subject')}
                error={errors.subject ? t('courses.nameHint') : undefined}
              >
                <input className="app-control" readOnly {...register('subject')} />
              </UIField>
              <UIField
                label={t('app.semester')}
                error={errors.semester ? t('courses.semesterHint') : undefined}
              >
                <select className="app-control" {...register('semester', { valueAsNumber: true })}>
                  {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                    <option key={value} value={value}>
                      {t('exams.semesterNumber', { semester: value })}
                    </option>
                  ))}
                </select>
              </UIField>
            </>
          )}
        </fieldset>
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" onClick={() => onClose()} disabled={isSaving}>
            {t('app.cancel')}
          </UIButton>
          <UIButton
            type="submit"
            disabled={isSaving || (course && !course.isMine)}
            aria-busy={isSaving}
          >
            {t('app.save')}
          </UIButton>
        </div>
      </form>
    </UIDialog>
  );
}
