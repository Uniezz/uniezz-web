import { useRef, type InputEvent, type ReactNode } from 'react';
import { cn } from '../../cn';
import { fieldStyles, fieldHintStyles, fieldCounterStyles } from './variants';

export type UIFieldProps = {
  label: string;
  /** The field's constraint, always shown; highlighted while the value breaks it. */
  hint?: string;
  error?: string;
  /** Shows `count/maxLength` inside the control while focused or near the limit; give the control the same `maxLength`. */
  maxLength?: number;
  count?: number;
  children: ReactNode;
  className?: string;
};
export const UIField = ({
  label,
  hint,
  error,
  maxLength,
  count = 0,
  children,
  className,
}: UIFieldProps) => {
  const counterRef = useRef<HTMLSpanElement>(null);

  // The browser silently drops input past maxLength; shake the counter so the limit is noticed.
  // React's onBeforeInput fires only for inserted text (typing, paste), with `data` set.
  const onBeforeInput = (event: InputEvent<HTMLSpanElement>) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    const selected = (field.selectionEnd ?? 0) - (field.selectionStart ?? 0);
    if (field.value.length - selected + event.data.length <= maxLength!) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    counterRef.current?.animate(
      (still ? [0, 0] : [0, -4, 4, -3, 3, 0]).map((x) => ({
        color: 'var(--color-warning)',
        translate: `${x}px 0`,
      })),
      { duration: 400, easing: 'ease-out' },
    );
  };

  return (
    <label className={cn(fieldStyles(), className)}>
      <span>{label}</span>
      {maxLength === undefined ? (
        children
      ) : (
        <span
          onBeforeInput={onBeforeInput}
          className="group relative block [&>input]:pr-20 [&>textarea]:pb-7"
        >
          {children}
          <span
            ref={counterRef}
            aria-hidden="true"
            className={fieldCounterStyles({
              invalid: Boolean(error),
              quiet: !error && count < maxLength * 0.8,
            })}
          >
            {count}/{maxLength}
          </span>
        </span>
      )}
      {(error || hint) && (
        <span
          role={error ? 'alert' : undefined}
          className={fieldHintStyles({ invalid: Boolean(error) })}
        >
          {error || hint}
        </span>
      )}
    </label>
  );
};
