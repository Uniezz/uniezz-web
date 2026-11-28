import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/ui/cn';

const tagClass =
  'inline-flex max-w-full items-center rounded-lg border border-white-10 bg-white-5 px-2 py-1 text-detail font-medium text-white-80';

/** The mobile app's post tag chip: a muted "#" and the tag; removable in the composer. */
export function PostTag({ tag, onRemove }: { tag: string; onRemove?: () => void }) {
  const { t } = useTranslation();
  const label = (
    <span className="min-w-0 truncate">
      <span className="font-semibold text-white-40">#</span>
      {tag}
    </span>
  );
  if (!onRemove) return <span className={tagClass}>{label}</span>;
  return (
    <button
      type="button"
      aria-label={`${t('app.remove')} #${tag}`}
      data-ph-capture-attribute-label="Remove tag"
      onPointerDown={(event) => event.preventDefault()}
      onClick={onRemove}
      className={cn(
        tagClass,
        'gap-1 pr-1.5 focus-visible:outline-2 focus-visible:outline-blue active:opacity-80',
      )}
    >
      {label}
      <X size={14} className="shrink-0 text-white-60" aria-hidden="true" />
    </button>
  );
}
