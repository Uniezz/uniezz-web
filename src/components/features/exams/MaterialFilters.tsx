import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { ExamsSearch } from '@/@types';
import { useUniversities } from '@/hooks';
import { UIButton, UISearch, UISelect } from '@/ui/components';
import { CreateCourseButton } from './CreateCourseButton';

const tabIds = ['reviews', 'professors', 'mine'] as const;
type ExamsTab = (typeof tabIds)[number];
const selectClass = 'app-control h-auto w-auto rounded-full text-label focus:border-white-10';

export function MaterialFilters() {
  const { t } = useTranslation();
  const { tab = 'reviews', university, semester, q } = useSearch({ from: '/_app/exams' });
  const navigate = useNavigate({ from: '/exams' });
  const { data: universities = [] } = useUniversities();
  const setSearch = (patch: Partial<ExamsSearch>) =>
    void navigate({ search: (previous) => ({ ...previous, ...patch }) });
  const [searchByTab, setSearchByTab] = useState<Partial<Record<ExamsTab, string>>>(() => ({
    [tab]: q ?? '',
  }));

  // Keep typing local until the user submits the search.
  const [text, setText] = useState(q ?? '');
  const [urlQ, setUrlQ] = useState(q);
  if (q !== urlQ) {
    // Back/forward or a submit changed the URL, so show its value.
    setUrlQ(q);
    setText(q ?? '');
    setSearchByTab((previous) => ({ ...previous, [tab]: q ?? '' }));
  }
  const selectTab = (next: ExamsTab) => {
    setText(searchByTab[next] ?? '');
    setSearch({
      tab: next === 'reviews' ? undefined : next,
      q: searchByTab[next] || undefined,
    });
  };
  const tabs: string[] = [t('app.courseReviews'), t('app.professorRatings'), t('app.myUploads')];
  const searchLabel = t(
    tab === 'professors'
      ? 'app.searchProfessors'
      : tab === 'mine'
        ? 'app.searchUploads'
        : 'app.searchCourses',
  );
  return (
    <div className="mb-5.5 space-y-4">
      <div
        role="tablist"
        aria-label={t('exams.title')}
        className="flex gap-6 border-b border-white-10"
      >
        {tabIds.map((id, index) => {
          const selected = id === tab;
          return (
            <button
              key={id}
              id={`exams-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="exams-tab-panel"
              tabIndex={selected ? 0 : -1}
              data-ph-capture-attribute-label={`View exams ${id}`}
              className={`flex-1 border-b-2 px-1 pb-3 text-center text-label font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue ${selected ? 'border-white text-white' : 'border-transparent text-secondary hover:text-white'}`}
              onClick={() => selectTab(id)}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                event.preventDefault();
                const direction = event.key === 'ArrowRight' ? 1 : -1;
                const next = tabIds[(index + direction + tabIds.length) % tabIds.length];
                selectTab(next);
                document.getElementById(`exams-tab-${next}`)?.focus();
              }}
            >
              {tabs[index]}
            </button>
          );
        })}
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <form
          role="search"
          className="relative min-w-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch({ q: text.trim() || undefined });
          }}
        >
          <UISearch
            value={text}
            onChange={(value) => {
              setText(value);
              setSearchByTab((previous) => ({ ...previous, [tab]: value }));
              if (!value.trim()) setSearch({ q: undefined });
            }}
            label={searchLabel}
            hideIcon
            hideClearButton
            className="pr-22"
          />
          {text && (
            <UIButton
              type="button"
              size="icon"
              bg="transparent"
              aria-label={t('app.clearSearch')}
              className="absolute top-1/2 right-11 -translate-y-1/2 border-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
              onClick={() => {
                setText('');
                setSearch({ q: undefined });
              }}
            >
              <X size={18} aria-hidden="true" />
            </UIButton>
          )}
          <UIButton
            type="submit"
            size="icon"
            bg="transparent"
            aria-label={t('exams.search')}
            className="absolute top-1/2 right-1 -translate-y-1/2 border-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
          >
            <Search size={18} aria-hidden="true" />
          </UIButton>
        </form>
        {tab === 'reviews' && <CreateCourseButton />}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <UISelect
          label={t('app.university')}
          className={selectClass}
          value={university ?? ''}
          onChange={(value) => setSearch({ university: value || undefined })}
          options={[
            { value: '', label: t('app.allUniversities') },
            ...universities.map(({ id }) => ({
              value: id,
              label: id.toLocaleUpperCase('en'),
              universityId: id,
            })),
          ]}
        />
        {tab !== 'professors' && (
          <UISelect
            label={t('app.semester')}
            className={selectClass}
            value={semester ? String(semester) : ''}
            onChange={(value) => setSearch({ semester: value ? Number(value) : undefined })}
            options={[
              { value: '', label: t('exams.anySemester') },
              ...Array.from({ length: 12 }, (_, index) => index + 1).map((value) => ({
                value: String(value),
                label: t('exams.semesterNumber', { semester: value }),
              })),
            ]}
          />
        )}
      </div>
    </div>
  );
}
