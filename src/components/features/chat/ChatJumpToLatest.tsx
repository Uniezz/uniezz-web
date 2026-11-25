import { ArrowDown } from 'lucide-react';

import { cn } from '@/ui/cn';
import { UIButton, type UIButtonProps } from '@/ui/components/UIButton';

export type ChatJumpToLatestProps = Omit<
  UIButtonProps,
  'children' | 'size' | 'bg' | 'navigateTo'
> & {
  unreadCount?: number;
  'aria-label': string;
};

export function ChatJumpToLatest({ unreadCount = 0, className, ...props }: ChatJumpToLatestProps) {
  return (
    <UIButton
      size="icon"
      bg="secondary"
      className={cn('relative bg-surface', className)}
      {...props}
      data-ph-capture-attribute-label="Jump to latest message"
    >
      <ArrowDown size={18} aria-hidden="true" />
      {unreadCount > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 min-w-5 rounded-full bg-blue px-1 text-center text-caption leading-5 font-semibold text-white"
        >
          {unreadCount}
        </span>
      ) : null}
    </UIButton>
  );
}
