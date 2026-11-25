import { FileText } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/ui/cn';
import { formatFileSize } from '@/utils/files';
import { attachmentCardStyles } from './variants';

type ChatAttachmentState =
  | { state: 'done' }
  | { state: 'uploading'; progress?: number; progressLabel: string }
  | { state: 'error'; error: string };

export type ChatAttachmentCardProps = ChatAttachmentState & {
  name: string;
  size: number;
  imageUrl?: string;
  action?: ReactNode;
  className?: string;
};

export function ChatAttachmentCard({
  name,
  size,
  imageUrl,
  action,
  className,
  ...status
}: ChatAttachmentCardProps) {
  return (
    <div
      data-slot="chat-attachment-card"
      data-state={status.state}
      className={cn(attachmentCardStyles({ state: status.state }), className)}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
      ) : (
        <FileText size={22} className="shrink-0 text-sky" aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1">
        <span className="block truncate text-label font-semibold">{name}</span>
        {status.state === 'uploading' ? (
          <div
            role="progressbar"
            aria-label={status.progressLabel}
            aria-valuenow={status.progress}
            className="mt-1.5 h-1 overflow-hidden rounded-full bg-white-20"
          >
            <div
              className={cn(
                'h-full rounded-full bg-blue',
                status.progress === undefined && 'w-1/3 motion-safe:animate-pulse',
              )}
              style={status.progress === undefined ? undefined : { width: `${status.progress}%` }}
            />
          </div>
        ) : (
          <span
            className={cn(
              'block truncate text-caption',
              status.state === 'error' ? 'text-danger' : 'text-secondary',
            )}
          >
            {status.state === 'error' ? status.error : formatFileSize(size)}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}
