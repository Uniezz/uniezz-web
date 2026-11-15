import { cn } from '../../cn';
import { subTabStyles, subTabsStyles } from './variants';

export type UISubTabsProps<T extends string> = {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  /** Accessible name of the tab list. */
  label: string;
  /** Tabs get `${idPrefix}-tab-${id}`; the page's tab panel must use `${idPrefix}-tab-panel`. */
  idPrefix: string;
  className?: string;
};

/** Full-width underline tabs; arrow keys move between them. */
export function UISubTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  idPrefix,
  className,
}: UISubTabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn(subTabsStyles(), className)}>
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            id={`${idPrefix}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idPrefix}-tab-panel`}
            tabIndex={selected ? 0 : -1}
            data-ph-capture-attribute-label={`View ${idPrefix} ${tab.id}`}
            className={subTabStyles({ selected })}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
              event.preventDefault();
              const direction = event.key === 'ArrowRight' ? 1 : -1;
              const next = tabs[(index + direction + tabs.length) % tabs.length];
              onChange(next.id);
              document.getElementById(`${idPrefix}-tab-${next.id}`)?.focus();
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
