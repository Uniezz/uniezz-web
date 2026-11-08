import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { type Option } from '@/@types';
import { cn } from '../../cn';
import { UIMenu } from '../UIMenu';
import { UIUniversityLogo } from '../UIUniversityLogo';

export type UISelectProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  /** Accessible name of the control, e.g. the field label */
  label: string;
  className?: string;
};

// The menu is a native popover anchored to the trigger in CSS: the browser puts it above any
// overflow: hidden, keeps it attached on scroll, flips it when there's no room below, and closes it
// on outside click or Escape.
export const UISelect = ({ value, options, onChange, label, className }: UISelectProps) => {
  const id = useId();
  const menuId = `select-menu-${id}`;
  const anchor = `--select-${id.replace(/[^\w-]/g, '')}`;
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <>
      <button
        type="button"
        data-ph-capture-attribute-label={label}
        popoverTarget={menuId}
        aria-label={`${label}: ${selected?.label ?? ''}`}
        style={{ anchorName: anchor }}
        className={cn(
          'flex w-full min-w-0 items-center justify-between gap-2 text-left outline-none focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-60',
          className,
        )}
      >
        {selected?.universityId && (
          <UIUniversityLogo universityId={selected.universityId} size="xs" />
        )}
        <span className="min-w-0 flex-1 truncate">{selected?.label}</span>
        <ChevronDown
          size={16}
          className={cn('shrink-0 transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      <UIMenu
        id={menuId}
        popover="auto"
        onToggle={(event) => setIsOpen(event.newState === 'open')}
        options={options}
        value={value}
        style={{
          position: 'fixed',
          positionAnchor: anchor,
          inset: 'auto',
          top: 'anchor(bottom)',
          left: 'anchor(left)',
          minWidth: 'anchor-size(width)',
          margin: '8px 0',
          positionTryFallbacks: 'flip-block',
        }}
        className="max-h-72 overflow-y-auto not-open:hidden"
        onSelect={(next) => {
          onChange(next);
          document.getElementById(menuId)?.hidePopover();
        }}
      />
    </>
  );
};
