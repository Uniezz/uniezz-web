import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { DatePreset, FeedFilterBarProps, FeedFilters, Option } from '@/@types';
import { useDropdown, useUniversities } from '@/hooks';
import { UIButton, UISelect } from '@/ui/components';
import { datePresetFrom } from '@/utils/feed';

export function FeedFilterBar({ filters, onChange }: FeedFilterBarProps) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const { ref, isOpen, toggle } = useDropdown();
  const activeCount = [filters.type, filters.university, filters.from].filter(Boolean).length;

  return (
    <div className="relative flex" ref={ref}>
      <UIButton
        className="relative size-10 shrink-0 backdrop-blur-[40px]"
        size="icon"
        bg={activeCount > 0 ? 'primary' : 'secondary'}
        aria-label={t('feed.filters')}
        title={t('feed.filters')}
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-blue text-detail font-semibold text-white">
            {activeCount}
          </span>
        )}
      </UIButton>
      {isOpen && (
        <div
          role="group"
          aria-label={t('feed.filters')}
          className="absolute top-full left-0 z-10 mt-2 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-2xl border border-white-10 bg-surface-60 p-3 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-[48px]"
        >
          <FilterField
            label={t('feed.type')}
            value={filters.type ?? ''}
            options={[
              { value: '', label: t('feed.allTypes') },
              { value: 'announcement', label: t('postComposer.post') },
              { value: 'question', label: t('app.question') },
              { value: 'event', label: t('app.event') },
            ]}
            onSelect={(type) =>
              onChange({ ...filters, type: (type || undefined) as FeedFilters['type'] })
            }
          />
          <FilterField
            label={t('app.university')}
            value={filters.university ?? ''}
            options={[
              { value: '', label: t('app.allUniversities') },
              ...universities.map(({ id }) => ({
                value: id,
                label: id.toUpperCase(),
                universityId: id,
              })),
            ]}
            onSelect={(university) => onChange({ ...filters, university: university || undefined })}
          />
          <FilterField
            label={t('feed.date')}
            value={filters.date ?? ''}
            options={[
              { value: '', label: t('feed.anyTime') },
              { value: 'today', label: t('feed.today') },
              { value: 'week', label: t('feed.thisWeek') },
              { value: 'month', label: t('feed.thisMonth') },
              { value: 'year', label: t('feed.thisYear') },
            ]}
            onSelect={(date) => {
              const preset = (date || undefined) as DatePreset | undefined;
              onChange({ ...filters, date: preset, from: preset && datePresetFrom(preset) });
            }}
          />
          <UIButton
            size="sm"
            bg="secondary"
            disabled={activeCount === 0}
            onClick={() => onChange({})}
          >
            {t('feed.clearAll')}
          </UIButton>
        </div>
      )}
    </div>
  );
}

function FilterField({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: Option[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-detail font-semibold text-secondary">{label}</span>
      <UISelect
        label={label}
        value={value}
        options={options}
        onChange={onSelect}
        className="h-10 rounded-full border border-white-10 bg-white-5 px-3.5 text-detail font-semibold text-white transition-colors hover:bg-white-10"
      />
    </div>
  );
}
