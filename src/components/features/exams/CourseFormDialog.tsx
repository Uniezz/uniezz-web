import type { CreateCourseForm, CourseFormDialogProps } from '@/@types';
// ai-design-check-ignore-file use-shared-components -- UIField and app-control are the established shared form pattern for react-hook-form in this project.
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { canUploadCourseMaterial, courseFormDefaults, studyFileTypeLabels } from '@/utils/exams';
import { UIButton, UIDialog, UIField, UIUnsavedChanges } from '@/ui/components';

export function CourseFormDialog({ course, onClose }: CourseFormDialogProps) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const { data: me } = useMyProfile();
  const { mutateAsync: create, isPending: isCreating } = useCreateCourse();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateCourse();
  const { mutateAsync: upload, isPending: isUploading } = useUploadStudyMaterial();
  const { mutateAsync: attach, isPending: isAttaching } = useAddCourseFile();
  const isPending = isCreating || isUpdating || isUploading || isAttaching;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseFormSchema),
    defaultValues: course
      ? { ...course, materials: [], materialType: 'exam' }
      : courseFormDefaults(me),
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
      } else {
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
        const uploaded = await Promise.all(values.materials.map((file) => upload(file)));
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
      }
      toast.success(t('courses.saved'));
      onClose(true);
    } catch {
      toast.error(t('apiState.error'));
    }
  }
  return (
    <UIDialog
      placement="right"
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      dismissible={!isPending}
      title={t(course ? 'courses.edit' : 'courses.create')}
      description={t('courses.formDescription')}
    >
      <UIUnsavedChanges dirty={isDirty} />
      <form
        className="space-y-4"
        onSubmit={handleSubmit(submit, () => captureAnalytics('course_form_validation_failed'))}
      >
        <fieldset disabled={isPending} className="space-y-4">
          {!course && (
            <UIField
              label={t('courses.materials')}
              hint={t('courses.materialsHint')}
              error={errors.materials ? t('courses.materialsHint') : undefined}
            >
              <Controller
                name="materials"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <>
                    <input
                      {...field}
                      type="file"
                      multiple
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      className="app-control"
                      data-ph-capture-attribute-label="Choose course materials"
                      onChange={(event) => onChange(Array.from(event.target.files ?? []))}
                    />
                    {value.length > 0 && (
                      <p className="mt-2 text-detail text-secondary">
                        {value.map((file) => file.name).join(', ')}
                      </p>
                    )}
                  </>
                )}
              />
              <select
                className="app-control mt-3"
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
              className="app-control min-h-28 resize-y"
              maxLength={5000}
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
          </UIField>
          <UIField
            label={t('courses.difficulty')}
            error={errors.difficulty ? t('courses.difficultyHint') : undefined}
          >
            <input
              type="number"
              className="app-control"
              min={1}
              max={5}
              step={1}
              {...register('difficulty', { valueAsNumber: true })}
            />
          </UIField>
          {!course && (
            <>
              <UIField
                label={t('app.university')}
                error={errors.universityId ? t('app.required') : undefined}
              >
                <select className="app-control" {...register('universityId')}>
                  <option value="">{t('courses.chooseUniversity')}</option>
                  {universities.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </UIField>
              <UIField
                label={t('app.faculty')}
                error={errors.faculty ? t('courses.nameHint') : undefined}
              >
                <input className="app-control" maxLength={150} {...register('faculty')} />
              </UIField>
              <UIField
                label={t('app.subject')}
                error={errors.subject ? t('courses.nameHint') : undefined}
              >
                <input className="app-control" maxLength={150} {...register('subject')} />
              </UIField>
              <UIField
                label={t('app.semester')}
                error={errors.semester ? t('courses.semesterHint') : undefined}
              >
                <input
                  className="app-control"
                  type="number"
                  min={1}
                  max={10}
                  step={1}
                  {...register('semester', { valueAsNumber: true })}
                />
              </UIField>
            </>
          )}
        </fieldset>
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" onClick={() => onClose()} disabled={isPending}>
            {t('app.cancel')}
          </UIButton>
          <UIButton type="submit" disabled={isPending || (course && !course.isMine)}>
            {t('app.save')}
          </UIButton>
        </div>
      </form>
    </UIDialog>
  );
}
