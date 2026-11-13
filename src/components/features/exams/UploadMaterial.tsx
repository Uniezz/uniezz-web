import type { UploadSchema, UploadMaterialProps } from '@/@types';
// ai-design-check-ignore-file use-shared-components -- UIButton and UISelect are the established shared controls.
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useCourse, useMyProfile, useAddCourseFile, useUploadStudyMaterial } from '@/hooks';
import {
  UIButton,
  UIDialog,
  UIDialogFooter,
  UIQueryError,
  UISelect,
  UIUnsavedChanges,
} from '@/ui/components';
import { uploadSchema } from '@/schemas';
import { canUploadCourseMaterial, studyFileTypeLabels } from '@/utils';
import { captureAnalytics } from '@/utils';
import { CourseMaterialsPicker } from './CourseMaterialsPicker';

export function UploadMaterial({ courseId, onClose }: UploadMaterialProps) {
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const { t } = useTranslation();
  const { data: course, isPending: isLoading, isError, refetch } = useCourse(courseId);
  const { data: me } = useMyProfile();
  const { mutateAsync: upload, isPending: isUploading } = useUploadStudyMaterial();
  const { mutateAsync: attach, isPending: isAttaching } = useAddCourseFile();
  const isPending = isUploading || isAttaching || isReadingFiles;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UploadSchema>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { files: [], type: 'exam' },
  });
  const files = useWatch({ control, name: 'files' });
  async function submit(values: UploadSchema) {
    if (!canUploadCourseMaterial(me, course)) return;
    try {
      const uploadedFiles = await Promise.all(values.files.map((file) => upload(file)));
      await Promise.all(
        uploadedFiles.map(({ file, mediaId }) =>
          attach({
            courseId,
            body: {
              mediaId,
              title: file.name.length < 3 ? `${file.name} file` : file.name.slice(0, 150),
              type: values.type,
            },
          }),
        ),
      );
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
          className="flex min-h-0 flex-1 flex-col gap-4"
          onSubmit={handleSubmit(submit, () =>
            captureAnalytics('study_material_validation_failed'),
          )}
        >
          <fieldset disabled={isPending} className="flex-1 space-y-4">
            <fieldset
              className="flex min-w-0 flex-col gap-1.5 text-micro font-semibold text-secondary"
              aria-describedby="course-materials-hint"
            >
              <legend>{t('courses.materials')}</legend>
              <CourseMaterialsPicker
                files={files}
                disabled={isPending}
                onReadingChange={setIsReadingFiles}
                onFilesChange={(nextFiles) =>
                  setValue('files', nextFiles, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
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
              </CourseMaterialsPicker>
              <p
                id="course-materials-hint"
                role={errors.files ? 'alert' : undefined}
                className={errors.files ? 'font-medium text-warning' : 'font-medium text-muted'}
              >
                {t('courses.materialsHint')}
              </p>
            </fieldset>
          </fieldset>
          <UIDialogFooter>
            <UIButton bg="secondary" disabled={isPending} onClick={() => onClose()}>
              {t('app.cancel')}
            </UIButton>
            <UIButton type="submit" disabled={isPending}>
              {t('exams.action')}
            </UIButton>
          </UIDialogFooter>
        </form>
      )}
    </UIDialog>
  );
}
