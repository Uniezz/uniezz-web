import { cn } from '../../cn';
import { tagsCounterStyles, tagsStyles, tagStyles } from './variants';

export type UITagsProps = {
  tags: string[] | null | undefined;
  /** Accessible name of the list. */
  label?: string;
  variant?: 'tag' | 'hashtag';
  /** Shows this many tags, then a "+N" counter for the rest. */
  max?: number;
  /** Tags to highlight, announced to screen readers with highlightLabel. */
  highlight?: (tag: string) => boolean;
  highlightLabel?: string;
  className?: string;
};

/** One horizontally scrolling row of tags. */
export const UITags = ({
  tags,
  label,
  variant = 'tag',
  max,
  highlight,
  highlightLabel,
  className,
}: UITagsProps) => {
  if (!tags?.length) return null;
  const shown = max === undefined ? tags : tags.slice(0, max);
  const hidden = tags.length - shown.length;
  return (
    <ul aria-label={label} className={cn(tagsStyles(), className)}>
      {shown.map((tag) => {
        const highlighted = highlight?.(tag) ?? false;
        return (
          <li key={tag} className={tagStyles({ variant, highlighted })}>
            {tag}
            {highlighted && highlightLabel && <span className="sr-only">, {highlightLabel}</span>}
          </li>
        );
      })}
      {hidden > 0 && <li className={tagsCounterStyles({ variant })}>+{hidden}</li>}
    </ul>
  );
};
