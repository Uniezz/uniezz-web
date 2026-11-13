import { lazy, memo, Suspense, useState } from 'react';
import { Eye, FileText, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UIButton, UIDialog } from '@/ui/components';

const CourseFileViewer = lazy(() => import('./CourseFileViewer'));

export function courseMaterialKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export const CourseMaterialPreview = memo(function CourseMaterialPreview({
  file,
  preview,
  removeLabel,
  onRemove,
}: {
  file: File;
  preview?: string;
  removeLabel: string;
  onRemove: (key: string) => void;
}) {
  const { t } = useTranslation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const key = courseMaterialKey(file);
  return (
    <>
      <div className="w-36 shrink-0">
        <div className="relative size-36 overflow-hidden rounded-feature border border-white-10 bg-surface">
          {preview ? (
            <img
              src={preview}
              alt={file.name}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-white-5 text-secondary">
              <FileText size={28} aria-hidden="true" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1">
            <UIButton
              size="icon"
              bg="transparent"
              aria-label={`${t('courses.previewMaterial')}: ${file.name}`}
              className="border-0 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] transition-colors enabled:hover:bg-transparent enabled:hover:text-blue"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye size={18} aria-hidden="true" />
            </UIButton>
            <UIButton
              size="icon"
              bg="transparent"
              aria-label={removeLabel}
              title={removeLabel}
              className="border-0 text-danger transition-colors enabled:hover:bg-transparent enabled:hover:text-danger-hover"
              onClick={() => onRemove(key)}
            >
              <Trash2 size={18} aria-hidden="true" />
            </UIButton>
          </div>
        </div>
        <p className="mt-1 truncate px-1 text-detail font-medium text-secondary" title={file.name}>
          {file.name}
        </p>
      </div>
      <UIDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        placement="right"
        className="max-w-3xl"
        title={file.name}
        description={t('courses.materials')}
      >
        <Suspense fallback={<p role="status">{t('apiState.loading')}</p>}>
          <CourseFileViewer file={file} />
        </Suspense>
      </UIDialog>
    </>
  );
});
