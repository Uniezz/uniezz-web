import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { studyMaterialFilesSchema } from '@/schemas';
import { readImageFile, toast } from '@/utils';
import { CourseMaterialPreview, courseMaterialKey } from './CourseMaterialPreview';

export type CourseMaterialsPickerProps = {
  files: File[];
  disabled: boolean;
  onFilesChange: (files: File[]) => void;
  onReadingChange: (isReading: boolean) => void;
  children?: ReactNode;
  /** `rows`: the mobile app's picker, file names in rows over a full-width Choose files button. */
  appearance?: 'tiles' | 'rows';
};

export function CourseMaterialsPicker({
  files,
  disabled,
  onFilesChange,
  onReadingChange,
  children,
  appearance = 'tiles',
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

  const fileInput = (
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
  );
  if (appearance === 'rows') {
    return (
      <div className="flex flex-col gap-2">
        {files.length > 0 && (
          <ul aria-label={t('courses.materials')} className="flex flex-col gap-2">
            {files.map((file) => (
              <li
                key={courseMaterialKey(file)}
                className="flex items-center gap-3 rounded-[14px] bg-white-5 px-3.5 py-2.5"
              >
                <span className="min-w-0 flex-1 truncate text-body text-white">{file.name}</span>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`${t('courses.removeMaterial')}: ${file.name}`}
                  data-ph-capture-attribute-label="Remove course material"
                  onClick={() => removeFile(courseMaterialKey(file))}
                  className="shrink-0 text-secondary disabled:opacity-40"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <label
          htmlFor={inputId}
          data-ph-capture-attribute-label="Choose course materials"
          className="group block cursor-pointer"
        >
          {fileInput}
          <span className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white-10 bg-white-5 px-5 text-body font-semibold group-hover:bg-white-10 peer-focus-visible:outline-2 peer-focus-visible:outline-blue peer-disabled:cursor-not-allowed peer-disabled:opacity-40">
            <Upload size={18} aria-hidden="true" />
            {t('study.chooseFiles')}
          </span>
        </label>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(8rem,0.55fr)] gap-3">
      <label
        htmlFor={inputId}
        data-ph-capture-attribute-label="Choose course materials"
        className="group block cursor-pointer"
      >
        {fileInput}
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
          className="col-span-full mt-3 scrollbar-hidden flex h-44 max-w-full min-w-0 items-start gap-3 overflow-x-auto overflow-y-hidden rounded-feature [overflow-anchor:none] focus-visible:outline-2 focus-visible:outline-blue"
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
