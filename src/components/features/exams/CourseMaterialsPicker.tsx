import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { studyMaterialFilesSchema } from '@/schemas';
import { readImageFile } from '@/utils';
import { CourseMaterialPreview, courseMaterialKey } from './CourseMaterialPreview';

export type CourseMaterialsPickerProps = {
  files: File[];
  disabled: boolean;
  onFilesChange: (files: File[]) => void;
  onReadingChange: (isReading: boolean) => void;
  children: ReactNode;
};

export function CourseMaterialsPicker({
  files,
  disabled,
  onFilesChange,
  onReadingChange,
  children,
}: CourseMaterialsPickerProps) {
  const inputId = useId();
  const { t } = useTranslation();
  const [previews, setPreviews] = useState<{ key: string; src: string }[]>([]);
  const [isReading, setIsReading] = useState(false);

  async function addFiles(selected: File[]) {
    const knownKeys = new Set(files.map(courseMaterialKey));
    const added = selected.filter((file) => {
      const key = courseMaterialKey(file);
      if (knownKeys.has(key)) return false;
      knownKeys.add(key);
      return true;
    });
    if (!added.length) return;
    if (!studyMaterialFilesSchema.safeParse([...files, ...added]).success) {
      toast.error(t('courses.materialsHint'));
      return;
    }

    setIsReading(true);
    onReadingChange(true);
    try {
      const imagePreviews = await Promise.all(
        added
          .filter((file) => file.type.startsWith('image/'))
          .map(async (file) => ({ key: courseMaterialKey(file), src: await readImageFile(file) })),
      );
      setPreviews((previous) => [...previous, ...imagePreviews]);
      onFilesChange([...files, ...added]);
    } catch {
      toast.error(t('courses.fileHint'));
    } finally {
      setIsReading(false);
      onReadingChange(false);
    }
  }

  function removeFile(key: string) {
    onFilesChange(files.filter((file) => courseMaterialKey(file) !== key));
    setPreviews((previous) => previous.filter((preview) => preview.key !== key));
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(8rem,0.55fr)] gap-3">
      <label
        htmlFor={inputId}
        data-ph-capture-attribute-label="Choose course materials"
        className="group block cursor-pointer"
      >
        <input
          id={inputId}
          type="file"
          multiple
          accept="application/pdf,image/jpeg,image/png,image/webp"
          className="peer sr-only"
          disabled={disabled || isReading}
          onChange={(event) => {
            const selected = Array.from(event.currentTarget.files ?? []);
            event.currentTarget.value = '';
            void addFiles(selected);
          }}
        />
        <span className="app-control flex cursor-pointer items-center justify-between gap-3 group-hover:bg-white-10 peer-focus-visible:outline-2 peer-focus-visible:outline-blue peer-disabled:cursor-not-allowed peer-disabled:opacity-40">
          <span>{t('courses.chooseFiles')}</span>
          <Upload size={18} aria-hidden="true" />
        </span>
      </label>
      {children}
      {files.length > 0 && (
        <div
          role="region"
          aria-label={t('courses.materials')}
          tabIndex={0}
          className="col-span-full mt-3 flex h-44 max-w-full min-w-0 items-start gap-3 overflow-x-auto overflow-y-hidden rounded-feature [overflow-anchor:none] focus-visible:outline-2 focus-visible:outline-blue"
        >
          {files.map((file) => (
            <CourseMaterialPreview
              key={courseMaterialKey(file)}
              file={file}
              preview={previews.find((preview) => preview.key === courseMaterialKey(file))?.src}
              removeLabel={t('courses.removeMaterial')}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
