import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/ui/cn';
import { markerStyles } from './variants';

export type ChatMarkerProps = ComponentProps<'div'> & {
  /** `chip` is a date, `divider` starts the new messages, `note` is a system message. */
  variant: NonNullable<VariantProps<typeof markerStyles>['variant']>;
};

export function ChatMarker({ variant, className, children, ...props }: ChatMarkerProps) {
  return (
    <div data-slot="chat-marker" className={cn(markerStyles({ variant }), className)} {...props}>
      <span
        className={cn(
          'min-w-0 wrap-break-word',
          variant === 'chip' && 'rounded-full bg-white-10 px-3 py-1',
        )}
      >
        {children}
      </span>
    </div>
  );
}
