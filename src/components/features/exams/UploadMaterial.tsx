import type { UploadSchema, UploadMaterialProps } from '@/@types';
// ai-design-check-ignore-file use-shared-components -- UIField and app-control are the established form controls for react-hook-form.
import { useId, useState } from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, useWatch } from 'react-hook-form';
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
import { readImageFile } from '@/utils/image';
import { CourseMaterialPreview, courseMaterialKey } from './CourseMaterialPreview';

export function UploadMaterial({ courseId, onClose }: UploadMaterialProps) {
  const fileInputId = useId();
  const [filePreviews, setFilePreviews] = useState<{ key: string; src: string }[]>([]);
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
          className="space-y-4"
          onSubmit={handleSubmit(submit, () =>
            captureAnalytics('study_material_validation_failed'),
          )}
        >
          <fieldset disabled={isPending} className="space-y-4">
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
              labelAs="div"
              label={t('courses.chooseFiles')}
              hint={t('courses.materialsHint')}
              error={errors.files ? t('courses.materialsHint') : undefined}
            >
              <label
                htmlFor={fileInputId}
                data-ph-capture-attribute-label="Choose course materials"
                className="group block cursor-pointer"
              >
                <input
                  id={fileInputId}
                  type="file"
                  multiple
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  className="peer sr-only"
                  onChange={async (event) => {
                    const selected = Array.from(event.currentTarget.files ?? []);
                    event.currentTarget.value = '';
                    if (!selected.length) return;
                    const selectedKeys = new Set(files.map(courseMaterialKey));
                    const added = selected.filter((file) => {
                      const key = courseMaterialKey(file);
                      if (selectedKeys.has(key)) return false;
                      selectedKeys.add(key);
                      return true;
                    });
                    if (!added.length) return;
                    setIsReadingFiles(true);
                    try {
                      const previews = await Promise.all(
                        added
                          .filter((file) => file.type.startsWith('image/'))
                          .map(async (file) => ({
                            key: courseMaterialKey(file),
                            src: await readImageFile(file),
                          })),
                      );
                      setFilePreviews((previous) => [...previous, ...previews]);
                      setValue('files', [...files, ...added], {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    } catch {
                      toast.error(t('courses.fileHint'));
                    } finally {
                      setIsReadingFiles(false);
                    }
                  }}
                />
                <span className="app-control flex cursor-pointer items-center justify-between gap-3 group-hover:bg-white-10 peer-focus-visible:outline-2 peer-focus-visible:outline-blue peer-disabled:cursor-not-allowed peer-disabled:opacity-40">
                  <span>{t('courses.chooseFiles')}</span>
                  <Upload size={18} aria-hidden="true" />
                </span>
              </label>
            </UIField>
            {files.length > 0 && (
              <div className="flex h-44 max-w-full items-start gap-3 overflow-x-auto overflow-y-hidden">
                {files.map((file) => (
                  <CourseMaterialPreview
                    key={courseMaterialKey(file)}
                    file={file}
                    preview={
                      filePreviews.find((preview) => preview.key === courseMaterialKey(file))?.src
                    }
                    removeLabel={t('courses.removeMaterial')}
                    onRemove={(key) => {
                      setValue(
                        'files',
                        files.filter((item) => courseMaterialKey(item) !== key),
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        },
                      );
                      setFilePreviews((previous) => previous.filter((item) => item.key !== key));
                    }}
                  />
                ))}
              </div>
            )}
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
