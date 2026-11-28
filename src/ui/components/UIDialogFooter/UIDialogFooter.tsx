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
        // on a phone, the mobile app's sheet footer: buttons share the row, 56 high, 17 semibold
        'max-lg:flex-nowrap max-lg:gap-2 max-lg:[&>*]:min-w-0 max-lg:[&>*]:flex-1 max-lg:[&>button]:min-h-14 max-lg:[&>button]:text-section',
        className,
      )}
    >
      {children}
    </div>
  );
}
