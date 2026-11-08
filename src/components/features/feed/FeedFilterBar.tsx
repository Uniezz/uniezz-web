import { useTranslation } from 'react-i18next';

import type { FeedFilters, Option } from '@/@types';
import { useUniversities } from '@/hooks';
import { cn } from '@/ui/cn';
import { UISelect } from '@/ui/components';
import { datePresetFrom, type DatePreset } from '@/utils/feed';

export function FeedFilterBar({
  filters,
  onChange,
}: {
  filters: FeedFilters & { date?: DatePreset };
  onChange: (filters: FeedFilters & { date?: DatePreset }) => void;
}) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();

  return (
    <div role="group" aria-label={t('feed.filters')} className="flex flex-wrap gap-2">
      <FilterSelect
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
      <FilterSelect
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
      <FilterSelect
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
    </div>
  );
}

function FilterSelect({
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
    <UISelect
      label={label}
      value={value}
      options={options}
      onChange={onSelect}
      className={cn(
        'h-10 w-auto gap-1.5 rounded-full border px-3.5 text-detail font-semibold backdrop-blur-[40px] transition-colors',
        value
          ? 'border-white bg-white text-ink'
          : 'border-white-10 bg-white-5 text-secondary hover:bg-white-10',
      )}
    />
  );
}
