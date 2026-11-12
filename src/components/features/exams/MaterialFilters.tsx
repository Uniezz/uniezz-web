import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { ExamsSearch } from '@/@types';
import { useUniversities } from '@/hooks';
import { UIButton, UISearch, UISegmented, UISelect } from '@/ui/components';

const tabIds = ['reviews', 'professors', 'mine'] as const;
const selectClass = 'app-control h-auto w-auto rounded-full text-label focus:border-white-10';

export function MaterialFilters() {
  const { t } = useTranslation();
  const { tab = 'reviews', university, semester, q } = useSearch({ from: '/_app/exams' });
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

  const tabs: string[] = [t('app.courseReviews'), t('app.professorRatings'), t('app.myUploads')];
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
            setSearch({ tab: next === 'reviews' ? undefined : next });
          }}
        />
        <div className="flex-1" />
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
    </>
  );
}
