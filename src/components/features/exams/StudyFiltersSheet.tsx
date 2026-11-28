import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useUniversities } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIChip, UIDialog, UIUniversityLogo } from '@/ui/components';

export type StudyFiltersSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  universityId?: string;
  semester?: number;
  showSemester: boolean;
  onUniversityChange: (universityId: string | undefined) => void;
  onSemesterChange: (semester: number | undefined) => void;
};

/** The mobile app's StudyFilters: a "Filters" bottom sheet with university and semester chips. */
export function StudyFiltersSheet({
  isOpen,
  onOpenChange,
  universityId,
  semester,
  showSemester,
  onUniversityChange,
  onSemesterChange,
}: StudyFiltersSheetProps) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const handleAllUniversities = () => onUniversityChange(undefined);
  const handleAnySemester = () => onSemesterChange(undefined);
  return (
    <UIDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      title={t('study.filters')}
      className="max-lg:rounded-t-feature max-lg:bg-surface/85 max-lg:px-4 max-lg:backdrop-blur-xl"
    >
      <div className="mt-4 flex flex-col gap-4">
        <FilterRow label={t('app.university')}>
          <FilterChip selected={universityId === undefined} onClick={handleAllUniversities}>
            {t('app.allUniversities')}
          </FilterChip>
          {universities.map(({ id }) => (
            <FilterChip
              key={id}
              selected={universityId === id}
              onClick={() => onUniversityChange(id)}
            >
              <UIUniversityLogo universityId={id} size="xs" />
              {id.toUpperCase()}
            </FilterChip>
          ))}
        </FilterRow>
        {showSemester && (
          <FilterRow label={t('app.semester')}>
            <FilterChip selected={semester === undefined} onClick={handleAnySemester}>
              {t('exams.anySemester')}
            </FilterChip>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
              <FilterChip
                key={value}
                selected={semester === value}
                onClick={() => onSemesterChange(value)}
              >
                {value}
              </FilterChip>
            ))}
          </FilterRow>
        )}
      </div>
    </UIDialog>
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
      data-ph-capture-attribute-label="Pick study filter"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 px-3.5 py-1.75 text-detail font-semibold whitespace-nowrap',
        selected ? 'border-white' : 'text-white-80',
      )}
    >
      {children}
    </UIChip>
  );
}
