import type { ComponentProps } from 'react';

import { cn } from '@/ui/cn';
import { reactionStyles } from './variants';

export type ChatReactionProps = Omit<ComponentProps<'button'>, 'children' | 'type'> & {
  emoji: string;
  count: number;
  /** The student added this reaction. */
  selected?: boolean;
  'aria-label': string;
};

export function ChatReaction({
  emoji,
  count,
  selected = false,
  className,
  ...props
}: ChatReactionProps) {
  return (
    <button
      type="button"
      data-slot="chat-reaction"
      aria-pressed={selected}
      className={cn(reactionStyles({ selected }), className)}
      {...props}
      data-ph-capture-attribute-label="Toggle message reaction"
    >
      <span aria-hidden="true">{emoji}</span>
      <span aria-hidden="true">{count}</span>
    </button>
  );
}
