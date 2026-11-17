import { FileText } from 'lucide-react';

import { cn } from '@/ui/cn';
import { formatFileSize } from '@/utils';

export function ChatFileChip({
  name,
  size,
  className,
}: {
  name: string;
  size: number;
  className?: string;
}) {
  return (
    <span className={cn('flex min-w-0 items-center gap-2.5 rounded-xl bg-white-10 p-2', className)}>
      <FileText size={22} className="shrink-0" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block truncate text-label font-semibold">{name}</span>
        <span className="block text-caption text-secondary">{formatFileSize(size)}</span>
      </span>
    </span>
  );
}
