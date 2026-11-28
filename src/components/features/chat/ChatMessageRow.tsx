import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/ui/cn';
import { messageRowStyles } from './variants';

type RowVariants = VariantProps<typeof messageRowStyles>;

export type ChatMessageRowProps = ComponentProps<'div'> & {
  align: NonNullable<RowVariants['align']>;
  /** Place in a group of messages from one sender. */
  position?: NonNullable<RowVariants['position']>;
  avatar?: ReactNode;
  /** Content under the bubble, such as reactions or the seen status. */
  footer?: ReactNode;
};

export function ChatMessageRow({
  align,
  position = 'single',
  avatar,
  footer,
  className,
  children,
  ...props
}: ChatMessageRowProps) {
  const incoming = align === 'start';
  return (
    <div
      role="listitem"
      data-slot="chat-message-row"
      className={cn(messageRowStyles({ align, position }), className)}
      {...props}
    >
      <div className="flex w-full min-w-0 items-end gap-2">
        {incoming ? (
          // On a phone, a group names the sender under the run instead, as in the app.
          <div data-slot="chat-message-avatar" className="size-7 shrink-0 max-lg:hidden">
            {avatar}
          </div>
        ) : null}
        <div className={cn('flex min-w-0 flex-1 flex-col', incoming ? 'items-start' : 'items-end')}>
          {children}
        </div>
      </div>
      {footer ? (
        <div
          data-slot="chat-message-footer"
          className={cn(
            'flex max-w-full flex-wrap gap-1.5 pt-1.5 text-caption text-secondary',
            incoming ? 'pl-9 max-lg:pl-0' : 'justify-end',
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
