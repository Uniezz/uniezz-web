import type { ReactNode } from 'react';

import { cn } from '@/ui/cn';
import { rowRadioStyles, rowstyles } from '@/ui/components/UIRow/variants';

/** One row of the mobile app's inset RowPicker with any content: the whole row toggles, a ring shows it. */
export function ChatPickerRow({
  selected,
  onClick,
  label,
  role = 'radio',
  children,
}: {
  selected: boolean;
  onClick: () => void;
  /** Fixed text for analytics; the row content may be user content. */
  label: string;
  role?: 'radio' | 'checkbox';
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      data-ph-capture-attribute-label={label}
      onClick={onClick}
      className={cn(rowstyles({ appearance: 'inset', selected }), 'min-w-0')}
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">{children}</span>
      <span className={rowRadioStyles({ selected })} aria-hidden>
        {selected ? <span className="size-2.5 rounded-full bg-sky" /> : null}
      </span>
    </button>
  );
}
