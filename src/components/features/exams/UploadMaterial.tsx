import type { UploadSchema, UploadMaterialProps } from '@/@types';
// ai-design-check-ignore-file use-shared-components -- UIField and app-control are the established form controls for react-hook-form.
import { useTranslation } from 'react-i18next';
import { Controller, useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useCourse, useMyProfile, useAddCourseFile, useUploadStudyMaterial } from '@/hooks';
import {
  UIButton,
  UIDialog,
  UIField,
  UIQueryError,
  UISelect,
  UIUnsavedChanges,
} from '@/ui/components';
import { uploadSchema } from '@/schemas';
import { canUploadCourseMaterial, studyFileTypeLabels } from '@/utils/exams';
import { captureAnalytics } from '@/utils/analytics';

export function UploadMaterial({ courseId, onClose }: UploadMaterialProps) {
  const { t } = useTranslation();
  const { data: course, isPending: isLoading, isError, refetch } = useCourse(courseId);
  const { data: me } = useMyProfile();
  const { mutateAsync: upload, data: uploaded, isPending: isUploading } = useUploadStudyMaterial();
  const { mutateAsync: attach, isPending: isAttaching } = useAddCourseFile();
  const isPending = isUploading || isAttaching;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UploadSchema>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { title: '', type: 'exam' },
  });
  const {
    field: { name: fileName, ref: fileRef, onBlur: onFileBlur, onChange: onFileChange },
  } = useController({ control, name: 'file' });
  async function submit(values: UploadSchema) {
    if (!canUploadCourseMaterial(me, course)) return;
    try {
      const result = uploaded?.file === values.file ? uploaded : await upload(values.file);
      await attach({
        courseId,
        body: { mediaId: result.mediaId, title: values.title, type: values.type },
      });
      toast.success(t('courses.materialUploaded'));
      onClose(true);
    } catch {
      toast.error(t('apiState.error'));
    }
  }
  return (
    <UIDialog
      open
      placement="right"
      dismissible={!isPending}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={t('exams.action')}
      description={course?.name ?? t('apiState.loading')}
    >
      <UIUnsavedChanges dirty={isDirty} />
      {isLoading ? (
        <p role="status">{t('apiState.loading')}</p>
      ) : isError ? (
        <UIQueryError retry={() => void refetch()} />
      ) : !canUploadCourseMaterial(me, course) ? (
        <p role="alert">{t('courses.uploadEligibility')}</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={handleSubmit(submit, () =>
            captureAnalytics('study_material_validation_failed'),
          )}
        >
          <fieldset disabled={isPending} className="space-y-4">
            <UIField
              label={t('postComposer.title')}
              error={errors.title ? t('courses.nameHint') : undefined}
            >
              <input
                data-ph-capture-attribute-label="Material title"
                className="app-control"
                maxLength={150}
                {...register('title')}
              />
            </UIField>
            <UIField label={t('app.type')}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <UISelect
                    label={t('app.type')}
                    className="app-control"
                    value={field.value}
                    onChange={field.onChange}
                    options={(['exam', 'colloquium', 'lab', 'notes'] as const).map((type) => ({
                      value: type,
                      label: t(studyFileTypeLabels[type]),
                    }))}
                  />
                )}
              />
            </UIField>
            <UIField
              label={t('courses.file')}
              hint={t('courses.fileHint')}
              error={errors.file ? t('courses.fileHint') : undefined}
            >
              <input
                type="file"
                data-ph-capture-attribute-label="Choose study material file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                className="app-control"
                name={fileName}
                ref={fileRef}
                onBlur={onFileBlur}
                onChange={(event) => onFileChange(event.target.files?.[0])}
              />
            </UIField>
          </fieldset>
          <div className="flex justify-end gap-3">
            <UIButton bg="secondary" disabled={isPending} onClick={() => onClose()}>
              {t('app.cancel')}
            </UIButton>
            <UIButton type="submit" disabled={isPending}>
              {t('exams.action')}
            </UIButton>
          </div>
        </form>
      )}
    </UIDialog>
  );
}
