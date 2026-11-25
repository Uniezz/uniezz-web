import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/ui/cn';
import { bubbleMetaStyles, bubbleStyles } from './variants';

export type ChatBubbleProps = ComponentProps<'div'> & {
  variant: NonNullable<VariantProps<typeof bubbleStyles>['variant']>;
  /** The small corner on the last bubble of a group. */
  tail?: boolean;
  sender?: ReactNode;
  /** Time and status. */
  meta?: ReactNode;
};

export function ChatBubble({
  variant,
  tail = false,
  sender,
  meta,
  className,
  children,
  ...props
}: ChatBubbleProps) {
  return (
    <div
      data-slot="chat-bubble"
      className={cn(bubbleStyles({ variant, tail }), className)}
      {...props}
    >
      {sender ? (
        <div data-slot="chat-bubble-sender" className="text-label font-semibold text-sky">
          {sender}
        </div>
      ) : null}
      {children}
      {meta ? (
        <div data-slot="chat-bubble-meta" className={bubbleMetaStyles({ variant })}>
          {meta}
        </div>
      ) : null}
    </div>
  );
}
