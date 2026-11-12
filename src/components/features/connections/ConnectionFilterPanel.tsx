import { useId, type ReactNode } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { ChevronDown, Mars, Minus, SlidersHorizontal, Venus } from 'lucide-react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { ConnectionFilters, Gender, StudyLevel } from '@/@types';
import { useMyConnectionPreferences, useUniversities } from '@/hooks';
import { useDropdown } from '@/hooks/useDropdown';
import { cn } from '@/ui/cn';
import {
  UIButton,
  UIChip,
  UIMenu,
  UIPanel,
  UISegmented,
  UISwitch,
  UIUniversityLogo,
} from '@/ui/components';
// TODO(api): Replace mock defaults with API-backed discovery filtering.
import { defaultConnectionFilters, facultyKey } from '@/utils';
import { ConnectionPreferences } from './ConnectionPreferences';

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="space-y-2.5">
      <p className="text-micro font-semibold text-secondary">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function ConnectionFilterPanel({
  form,
  onApply,
}: {
  form: UseFormReturn<ConnectionFilters>;
  onApply: (filters: ConnectionFilters) => void;
}) {
  const { t } = useTranslation();
  const preferencesFormId = useId();
  const { data: preferences } = useMyConnectionPreferences();
  const isSaving = useIsMutating({ mutationKey: ['connections', 'preferences'] }) > 0;
  const { data: universities = [] } = useUniversities();
  const {
    mode = 'friends',
    universities: selectedUniversities = [],
    faculty = null,
    levels = [],
    matchInterests = false,
    gender = null,
  } = useWatch({ control: form.control });
  const isFiltered =
    selectedUniversities.length > 0 ||
    matchInterests ||
    gender !== null ||
    (mode === 'studyBuddy' && (faculty !== null || levels.length > 0));
  const modes = [
    { value: 'friends', label: t('app.friends') },
    { value: 'studyBuddy', label: t('app.studyBuddy') },
    { value: 'dating', label: t('app.dating') },
  ] as const;
  const genders: { value: Gender | null; label: string }[] = [
    { value: null, label: t('connections.everyone') },
    { value: 'female', label: t('connections.women') },
    { value: 'male', label: t('connections.men') },
  ];
  // One "Doctoral" chip covers both PhD tracks: old-style third-cycle studies and doctoral schools.
  const levelOptions: { values: StudyLevel[]; label: string }[] = [
    { values: ['first_cycle'], label: t('app.studyLevelFirstCycle') },
    { values: ['second_cycle'], label: t('app.studyLevelSecondCycle') },
    { values: ['long_cycle'], label: t('app.studyLevelLongCycle') },
    { values: ['third_cycle', 'phd_school'], label: t('app.studyLevelDoctoral') },
  ];

  return (
    // The fields scroll while the connection controls and Save stay visible.
    <UIPanel className="flex min-h-0 flex-col gap-3 xl:absolute xl:inset-0">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <h2 className="flex min-h-9 items-center gap-2 text-section font-semibold">
          <SlidersHorizontal className="size-4.5 text-secondary" aria-hidden="true" />
          {t('connections.filters')}
        </h2>
        <UISwitch
          label={t('connections.matchInterests')}
          className="justify-start gap-3"
          checked={matchInterests}
          onChange={(value) => form.setValue('matchInterests', value, { shouldDirty: true })}
        />
      </div>
      <div className="-mx-1 min-h-0 flex-1 space-y-3 overflow-y-auto px-1 pb-1">
        <div className="space-y-2.5">
          <p className="text-micro font-semibold text-secondary">{t('connections.showMe')}</p>
          <UISegmented
            options={genders.map((option) => option.label)}
            value={genders.find((option) => option.value === gender)!.label}
            onChange={(label) => {
              const option = genders.find((option) => option.label === label);
              if (option) form.setValue('gender', option.value, { shouldDirty: true });
            }}
            label={t('connections.showMe')}
            icons={{
              [t('connections.women')]: <Venus className="size-4 text-pink" aria-hidden="true" />,
              [t('connections.men')]: <Mars className="size-4 text-blue" aria-hidden="true" />,
            }}
          />
        </div>
        <FilterSection label={t('app.university')}>
          {universities.map(({ id }) => (
            <UIChip
              key={id}
              data-ph-capture-attribute-label={id.toUpperCase()}
              selected={selectedUniversities.includes(id)}
              className="inline-flex items-center gap-1.5 py-1.5 pl-1.5"
              onClick={() =>
                form.setValue('universities', toggle(selectedUniversities, id), {
                  shouldDirty: true,
                })
              }
            >
              <UIUniversityLogo universityId={id} />
              {id.toUpperCase()}
            </UIChip>
          ))}
        </FilterSection>
        {mode === 'studyBuddy' && (
          <>
            <div className="space-y-2.5">
              <p className="text-micro font-semibold text-secondary">{t('app.faculty')}</p>
              <FacultyPicker
                value={faculty}
                universityIds={selectedUniversities}
                onChange={(value) => form.setValue('faculty', value, { shouldDirty: true })}
              />
            </div>
            <FilterSection label={t('app.studyLevel')}>
              {levelOptions.map(({ values, label }) => {
                const selected = values.every((value) => levels.includes(value));
                return (
                  <UIChip
                    key={label}
                    data-ph-capture-attribute-label={label}
                    selected={selected}
                    onClick={() =>
                      form.setValue(
                        'levels',
                        selected
                          ? levels.filter((level) => !values.includes(level))
                          : [...levels, ...values.filter((value) => !levels.includes(value))],
                        { shouldDirty: true },
                      )
                    }
                  >
                    {label}
                  </UIChip>
                );
              })}
            </FilterSection>
          </>
        )}
        <ConnectionPreferences
          mode={mode}
          formId={preferencesFormId}
          onSaved={() =>
            onApply({
              mode,
              universities: selectedUniversities,
              faculty,
              levels,
              matchInterests,
              gender,
            })
          }
        />
      </div>
      <div className="flex shrink-0 items-end justify-between gap-3">
        <div className="min-w-0 space-y-3">
          <div className="space-y-2.5">
            <p className="text-micro font-semibold text-secondary">{t('connections.lookingFor')}</p>
            <UISegmented
              options={modes.map((option) => option.label)}
              value={modes.find((option) => option.value === mode)!.label}
              onChange={(label) => {
                const option = modes.find((option) => option.label === label);
                if (option) form.setValue('mode', option.value, { shouldDirty: true });
              }}
              label={t('connections.lookingFor')}
            />
          </div>
        </div>
        <UIButton
          size="sm"
          type="submit"
          form={preferencesFormId}
          disabled={!preferences || isSaving}
          className="shrink-0"
        >
          {t('app.save')}
        </UIButton>
      </div>
      <UIButton
        size="pill"
        bg="transparent"
        className={cn(
          '-ml-2 min-h-0 shrink-0 gap-1 self-start border-0 px-2 py-1 text-micro text-secondary enabled:hover:bg-transparent enabled:hover:text-danger',
          !isFiltered && 'invisible',
        )}
        onClick={() => form.reset({ ...defaultConnectionFilters, mode })}
      >
        <Minus className="size-3.5" aria-hidden="true" />
        {t('connections.resetFilters')}
      </UIButton>
    </UIPanel>
  );
}

function FacultyPicker({
  value,
  universityIds,
  onChange,
}: {
  value: string | null;
  universityIds: string[];
  onChange: (value: string | null) => void;
}) {
  const { t } = useTranslation();
  const { ref, isOpen, toggle: toggleMenu, close } = useDropdown();
  const { data: universities = [] } = useUniversities();
  const anyFaculty = { value: '', label: t('connections.anyFaculty') };
  const options = [
    anyFaculty,
    ...universities
      .filter(({ id }) => universityIds.length === 0 || universityIds.includes(id))
      .flatMap(({ id, faculties }) =>
        (faculties ?? []).map(({ name }) => ({
          value: facultyKey(id, name),
          label: name,
          universityId: id,
        })),
      ),
  ];
  const selected = options.find((option) => option.value === (value ?? '')) ?? anyFaculty;

  return (
    <div
      className="relative flex"
      ref={ref}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          close();
          ref.current?.querySelector('button')?.focus();
        }
      }}
    >
      <UIButton
        size="pill"
        bg="secondary"
        onClick={toggleMenu}
        aria-label={t('app.faculty')}
        aria-expanded={isOpen}
        className="w-full justify-between gap-2 text-left text-detail font-medium"
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown size={14} className="shrink-0" aria-hidden="true" />
      </UIButton>
      {isOpen && (
        <UIMenu
          options={options}
          value={value ?? ''}
          className="left-0 max-h-72 w-full max-w-none overflow-y-auto"
          onSelect={(next) => {
            onChange(next || null);
            close();
          }}
        />
      )}
    </div>
  );
}
