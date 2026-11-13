import type { ReactNode } from 'react';
import { cn } from '../../cn';

export type UIDialogFooterProps = {
  children: ReactNode;
  className?: string;
};

export function UIDialogFooter({ children, className }: UIDialogFooterProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 mt-auto flex shrink-0 flex-wrap items-center justify-end gap-3 bg-surface pt-4 pb-1',
        className,
      )}
    >
      {children}
    </div>
  );
}
