import { useState, type ReactNode } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { FeedFilterBarProps, FeedFilterValues } from '@/@types';
import { useUniversities } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIButton, UIChip, UIDialog, UIUniversityLogo } from '@/ui/components';
import { FEED_PHONE_DATE_PRESETS, FEED_PHONE_TYPES, midnightDaysAgo } from '@/utils';

/** The mobile app's feed filters: a glass icon button opening a bottom sheet of chip rows, applied on close. */
export function FeedFiltersSheet({ filters, onChange }: FeedFilterBarProps) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<FeedFilterValues>(filters);

  const handleOpen = () => {
    setDraft(filters);
    setIsOpen(true);
  };
  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setIsOpen(false);
    onChange(draft);
  };
  const pick = (next: FeedFilterValues) => setDraft({ ...draft, ...next });

  return (
    <>
      <UIButton
        size="square"
        bg="glass"
        aria-label={t('feed.filters')}
        aria-expanded={isOpen}
        onClick={handleOpen}
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
      </UIButton>
      <UIDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        placement="bottom"
        title={t('feed.filtersTitle')}
        className="max-lg:rounded-t-feature max-lg:bg-surface/85 max-lg:px-4 max-lg:backdrop-blur-xl"
      >
        <div className="mt-4 flex flex-col gap-4">
          <FilterRow label={t('feed.type')}>
            {FEED_PHONE_TYPES.map(([value, label]) => (
              <FilterChip
                key={value}
                selected={(draft.type ?? '') === value}
                onClick={() => pick({ type: value || undefined })}
              >
                {t(label)}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label={t('app.university')}>
            <FilterChip
              selected={!draft.university}
              onClick={() => pick({ university: undefined })}
            >
              {t('app.all')}
            </FilterChip>
            {universities.map(({ id }) => (
              <FilterChip
                key={id}
                selected={draft.university === id}
                onClick={() => pick({ university: id })}
              >
                <UIUniversityLogo universityId={id} size="xs" />
                {id.toUpperCase()}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label={t('feed.date')}>
            {FEED_PHONE_DATE_PRESETS.map(([value, label, days]) => (
              <FilterChip
                key={value}
                selected={(draft.date ?? '') === value}
                onClick={() =>
                  pick({
                    date: value || undefined,
                    from: days === null ? undefined : midnightDaysAgo(days),
                  })
                }
              >
                {t(label)}
              </FilterChip>
            ))}
          </FilterRow>
        </div>
      </UIDialog>
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-1.5">
      <span className="text-micro font-semibold text-secondary">{label}</span>
      {/* the chips bleed to the sheet edges and scroll under the fades */}
      <div className="-mx-4 scrollbar-hidden flex gap-1.5 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] px-4">
        {children}
      </div>
    </div>
  );
}

function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <UIChip
      selected={selected}
      onClick={onClick}
      data-ph-capture-attribute-label="Pick feed filter"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 px-3.5 py-1.75 text-detail font-semibold whitespace-nowrap',
        selected ? 'border-white' : 'text-white-80',
      )}
    >
      {children}
    </UIChip>
  );
}
