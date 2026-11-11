import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import type { ExamsSearch } from '@/schemas';
import { useUniversities } from '@/hooks';
import { UIButton, UISearch, UISegmented } from '@/ui/components';

const tabIds = ['papers', 'reviews', 'professors', 'mine'] as const;
const selectClass =
  'app-control h-auto w-auto appearance-none rounded-full pr-11 text-label hover:border-white-40 focus:border-white-10 focus:hover:border-white-40';

export function MaterialFilters() {
  const { t } = useTranslation();
  const { tab = 'papers', university, semester, q } = useSearch({ from: '/_app/exams' });
  const navigate = useNavigate({ from: '/exams' });
  const { data: universities = [] } = useUniversities();
  const setSearch = (patch: Partial<ExamsSearch>) =>
    void navigate({ search: (previous) => ({ ...previous, ...patch }) });

  // The box is local until Search is pressed; the URL (and so the lists) changes only then.
  const [text, setText] = useState(q ?? '');
  const [urlQ, setUrlQ] = useState(q);
  if (q !== urlQ) {
    // Back/forward or a submit changed the URL, so show its value.
    setUrlQ(q);
    setText(q ?? '');
  }

  const tabs: string[] = [
    t('app.pastPapers'),
    t('app.courseReviews'),
    t('app.professorRatings'),
    t('app.myUploads'),
  ];
  return (
    <>
      <form
        role="search"
        className="mb-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setSearch({ q: text.trim() || undefined });
        }}
      >
        {/* UISearch puts className on its inner box, so the wrapper takes the row's spare width. */}
        <div className="min-w-0 flex-1">
          <UISearch value={text} onChange={setText} label={t('app.searchMaterials')} />
        </div>
        <UIButton type="submit">{t('exams.search')}</UIButton>
      </form>
      <div className="mb-5.5 flex flex-wrap items-center gap-2">
        <UISegmented
          label={t('exams.title')}
          options={tabs}
          value={tabs[tabIds.indexOf(tab)]}
          onChange={(value) => {
            const next = tabIds[tabs.indexOf(value)];
            setSearch({ tab: next === 'papers' ? undefined : next });
          }}
        />
        <div className="flex-1" />
        <label className="relative inline-flex">
          <select
            className={selectClass}
            aria-label={t('app.university')}
            value={university ?? ''}
            onChange={(event) => setSearch({ university: event.target.value || undefined })}
          >
            <option value="">{t('app.allUniversities')}</option>
            {universities.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-white-80"
          />
        </label>
        {tab !== 'professors' && (
          <label className="relative inline-flex">
            <select
              className={selectClass}
              aria-label={t('app.semester')}
              value={semester ?? ''}
              onChange={(event) =>
                setSearch({ semester: event.target.value ? Number(event.target.value) : undefined })
              }
            >
              <option value="">{t('exams.anySemester')}</option>
              {/* shortcut: semesters 1–12 cover every Polish programme today; read the range from the API if one appears. */}
              {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  {t('exams.semesterNumber', { semester: value })}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-white-80"
            />
          </label>
        )}
      </div>
    </>
  );
}
