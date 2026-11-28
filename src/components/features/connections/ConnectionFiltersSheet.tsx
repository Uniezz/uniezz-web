import type { ReactNode } from 'react';
import { Controller, type Control, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { ConnectionFilters, Gender, StudyLevel } from '@/@types';
import { useUniversities } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIButton, UIChip, UIDialog, UISwitch, UIUniversityLogo } from '@/ui/components';
import { facultyKey } from '@/utils';

export type ConnectionPreferencesValues = { intent: string };

// "Show me", as the app's CONNECTION_GENDERS
const GENDERS = [
  [null, 'connections.everyone'],
  ['female', 'connections.women'],
  ['male', 'connections.men'],
] as const satisfies readonly (readonly [Gender | null, string])[];

// one Doctoral chip covers both PhD tracks
const LEVELS = [
  [['first_cycle'], 'app.studyLevelFirstCycle'],
  [['second_cycle'], 'app.studyLevelSecondCycle'],
  [['long_cycle'], 'app.studyLevelLongCycle'],
  [['third_cycle', 'phd_school'], 'app.studyLevelDoctoral'],
] as const satisfies readonly (readonly [readonly StudyLevel[], string])[];

/** removes the values when all are selected, otherwise adds the missing ones */
const toggleValues = <T,>(list: T[], values: readonly T[]) =>
  values.every((value) => list.includes(value))
    ? list.filter((item) => !values.includes(item))
    : [...list, ...values.filter((value) => !list.includes(value))];

/**
 * Phone-only: the mobile app's Meet filters form sheet — chip rows, the shared-interests switch and
 * the intent, with Save in the sheet's header. Closing it applies the filters.
 */
export function ConnectionFiltersSheet({
  open,
  onOpenChange,
  control,
  preferencesControl,
  mode,
  isSaveDisabled,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  control: Control<ConnectionFilters>;
  preferencesControl: Control<ConnectionPreferencesValues>;
  mode: ConnectionFilters['mode'];
  isSaveDisabled: boolean;
  onSave: () => void;
}) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  // the faculty chips follow the picked universities
  const selectedUniversities = useWatch({ control, name: 'universities' });
  const faculties = universities
    .filter(({ id }) => selectedUniversities.length === 0 || selectedUniversities.includes(id))
    .flatMap(({ id, faculties }) =>
      (faculties ?? []).map(({ name }) => ({ key: facultyKey(id, name), name })),
    );

  return (
    <UIDialog
      open={open}
      onOpenChange={onOpenChange}
      placement="bottom"
      title={t('connections.filters')}
      className="max-lg:rounded-t-feature max-lg:bg-surface/85 max-lg:px-4 max-lg:backdrop-blur-xl"
    >
      <UIButton
        size="pill"
        disabled={isSaveDisabled}
        onClick={onSave}
        className="absolute top-3.5 right-14"
      >
        {t('apiState.save')}
      </UIButton>
      <div className="mt-4 flex flex-col gap-3">
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <FilterRow label={t('connections.showMe')}>
              {GENDERS.map(([gender, label]) => (
                <FilterChip
                  key={label}
                  selected={field.value === gender}
                  onClick={() => field.onChange(gender)}
                >
                  {t(label)}
                </FilterChip>
              ))}
            </FilterRow>
          )}
        />
        <Controller
          control={control}
          name="universities"
          render={({ field }) => (
            <FilterRow label={t('app.university')}>
              <FilterChip selected={field.value.length === 0} onClick={() => field.onChange([])}>
                {t('app.all')}
              </FilterChip>
              {universities.map(({ id }) => (
                <FilterChip
                  key={id}
                  selected={field.value.includes(id)}
                  onClick={() => field.onChange(toggleValues(field.value, [id]))}
                >
                  <UIUniversityLogo universityId={id} size="xs" />
                  {id.toUpperCase()}
                </FilterChip>
              ))}
            </FilterRow>
          )}
        />
        {mode === 'studyBuddy' && (
          <>
            <Controller
              control={control}
              name="faculty"
              render={({ field }) => (
                <FilterRow label={t('app.faculty')}>
                  <FilterChip selected={field.value === null} onClick={() => field.onChange(null)}>
                    {t('connections.anyFaculty')}
                  </FilterChip>
                  {faculties.map(({ key, name }) => (
                    <FilterChip
                      key={key}
                      selected={field.value === key}
                      onClick={() => field.onChange(key)}
                    >
                      {name}
                    </FilterChip>
                  ))}
                </FilterRow>
              )}
            />
            <Controller
              control={control}
              name="levels"
              render={({ field }) => (
                <FilterRow label={t('app.studyLevel')}>
                  {LEVELS.map(([levels, label]) => (
                    <FilterChip
                      key={label}
                      selected={levels.every((level: StudyLevel) => field.value.includes(level))}
                      onClick={() => field.onChange(toggleValues(field.value, levels))}
                    >
                      {t(label)}
                    </FilterChip>
                  ))}
                </FilterRow>
              )}
            />
          </>
        )}
        <Controller
          control={control}
          name="matchInterests"
          render={({ field }) => (
            <UISwitch
              label={t('connections.matchInterests')}
              checked={field.value}
              onChange={field.onChange}
              className="justify-between [&>span]:font-semibold [&>span]:text-white"
            />
          )}
        />
        <div className="flex flex-col gap-3 pt-1">
          <span className="text-micro font-semibold text-secondary">
            {t('connections.preferences')}
          </span>
          <Controller
            control={preferencesControl}
            name="intent"
            render={({ field }) => (
              <label className="flex flex-col gap-2">
                <span className="text-detail font-semibold">{t('connections.intent')}</span>
                <textarea
                  className="app-control h-37.5 resize-none"
                  placeholder={t('connections.intentPlaceholder')}
                  maxLength={200}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </label>
            )}
          />
        </div>
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
      data-ph-capture-attribute-label="Pick connection filter"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 px-3.5 py-1.75 text-detail font-semibold whitespace-nowrap',
        selected ? 'border-white' : 'text-white-80',
      )}
    >
      {children}
    </UIChip>
  );
}
