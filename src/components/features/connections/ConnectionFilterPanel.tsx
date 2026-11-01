import { type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { ConnectionFilters, StudyLevel } from '@/@types';
import { useUniversities } from '@/hooks';
import { useDropdown } from '@/hooks/useDropdown';
import { UIButton, UIChip, UIMenu, UIPanel, UISegmented, UIUniversityLogo } from '@/ui/components';
// TODO(api): Replace mock defaults with API-backed discovery filtering.
import { CONNECTIONSMOCKS, facultyKey } from '@/utils';

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

export function ConnectionFilterPanel({ form }: { form: UseFormReturn<ConnectionFilters> }) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const {
    mode = 'friends',
    universities: selectedUniversities = [],
    faculty = null,
    levels = [],
  } = useWatch({ control: form.control });
  const isFiltered =
    selectedUniversities.length > 0 ||
    (mode === 'studyBuddy' && (faculty !== null || levels.length > 0));
  const modes = [
    { value: 'friends', label: t('app.friends') },
    { value: 'studyBuddy', label: t('app.studyBuddy') },
    { value: 'dating', label: t('app.dating') },
  ] as const;
  const levelOptions: { value: StudyLevel; label: string }[] = [
    { value: 'first_cycle', label: t('app.studyLevelFirstCycle') },
    { value: 'second_cycle', label: t('app.studyLevelSecondCycle') },
    { value: 'long_cycle', label: t('app.studyLevelLongCycle') },
    { value: 'phd_school', label: t('app.studyLevelPhdSchool') },
  ];

  return (
    <UIPanel className="space-y-5">
      <div className="flex min-h-9 items-center justify-between gap-3">
        <h2 className="text-section font-semibold">{t('connections.filters')}</h2>
        {isFiltered && (
          <UIButton
            size="pill"
            bg="transparent"
            className="min-h-0 px-2 py-1 text-micro"
            onClick={() => form.reset({ ...CONNECTIONSMOCKS.defaultFilters, mode })}
          >
            {t('connections.resetFilters')}
          </UIButton>
        )}
      </div>
      <div className="space-y-2.5">
        <p className="text-micro font-semibold text-secondary">{t('connections.lookingFor')}</p>
        <UISegmented
          options={modes.map((option) => option.label)}
          value={modes.find((option) => option.value === mode)!.label}
          onChange={(label) => {
            const option = modes.find((option) => option.label === label);
            if (option) form.setValue('mode', option.value);
          }}
          label={t('connections.lookingFor')}
        />
      </div>
      <FilterSection label={t('app.university')}>
        {universities.map(({ id }) => (
          <UIChip
            key={id}
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
            {levelOptions.map(({ value, label }) => (
              <UIChip
                key={value}
                selected={levels.includes(value)}
                onClick={() =>
                  form.setValue('levels', toggle(levels, value), { shouldDirty: true })
                }
              >
                {label}
              </UIChip>
            ))}
          </FilterSection>
        </>
      )}
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
