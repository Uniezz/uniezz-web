import { memo } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { UIButton } from '@/ui/components';

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
  const key = courseMaterialKey(file);
  return (
    <div className="relative size-36 shrink-0 overflow-hidden rounded-feature border border-white-10 bg-surface">
      {preview ? (
        <img src={preview} alt={file.name} className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 bg-white-5 text-secondary">
          <FileText size={28} aria-hidden="true" />
          <span className="text-detail font-semibold">PDF</span>
        </div>
      )}
      <span className="absolute inset-x-0 bottom-0 truncate bg-surface/90 px-2 py-2 text-micro text-white-80">
        {file.name}
      </span>
      <UIButton
        size="icon"
        bg="secondary"
        aria-label={removeLabel}
        title={removeLabel}
        className="absolute top-2 right-2 bg-surface"
        onClick={() => onRemove(key)}
      >
        <Trash2 size={16} className="text-danger" aria-hidden="true" />
      </UIButton>
    </div>
  );
});
