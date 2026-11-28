import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type TouchEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { ExamsSearch } from '@/@types';
import { examsSearchSchema } from '@/schemas';
import { useGoBack, useMyProfile, usePhoneViewport, useScrolledPast } from '@/hooks';
import { toast } from '@/utils';
import { UISearchOverlay, UISubTabs, UITopbar } from '@/ui/components';
import {
  CourseList,
  CoursesPhonePage,
  FilesPhonePage,
  MaterialFilters,
  MaterialTable,
  ProfessorList,
  ProfessorPhoneScreen,
  ProfessorsPhonePage,
  StudyFiltersSheet,
} from '@/components/features/exams';

export const Route = createFileRoute('/_app/exams')({
  validateSearch: (search: Record<string, unknown>) => examsSearchSchema.parse(search),
  component: ExamsPage,
});

const phoneTabs = ['reviews', 'professors', 'mine'] as const;
type ExamsTab = (typeof phoneTabs)[number];
// a horizontal swipe longer than this flips the page, as the app's pager
const SWIPE_DISTANCE = 60;
// as the mobile app's collapsing headers: compact once scrolled past this
const HEADER_COMPACT_OFFSET = 24;

function ExamsPage() {
  const isPhone = usePhoneViewport();
  return isPhone ? <ExamsPhonePage /> : <ExamsDesktopPage />;
}

function ExamsDesktopPage() {
  const { t } = useTranslation();
  const { tab = 'reviews' } = Route.useSearch();

  return (
    <div className="flex h-[calc(100svh-56px)] min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <UITopbar title={t('exams.title')} subtitle={t('exams.subtitle')} />
        <MaterialFilters />
      </div>
      <div
        id="exams-tab-panel"
        role="tabpanel"
        aria-labelledby={`exams-tab-${tab}`}
        tabIndex={0}
        className="flex min-h-0 flex-1 flex-col"
      >
        {tab === 'reviews' ? (
          <CourseList />
        ) : tab === 'professors' ? (
          <ProfessorList />
        ) : (
          <MaterialTable />
        )}
      </div>
      <Outlet />
    </div>
  );
}

/** The mobile app's Study tab: pinned header with tabs, three pages that keep their place. */
function ExamsPhonePage() {
  const { t } = useTranslation();
  const { tab = 'reviews', university, semester, q, professor } = Route.useSearch();
  const navigate = Route.useNavigate();
  const goBack = useGoBack();
  const { data: profile } = useMyProfile();
  const isHeaderCompact = useScrolledPast(HEADER_COMPACT_OFFSET);
  // `search` is the text being typed; a query applies on submit, shared by Courses and My materials
  const [search, setSearch] = useState(q ?? '');
  const [query, setQuery] = useState(q ?? '');
  const [professorQuery, setProfessorQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const scrollOffsets = useRef<Partial<Record<ExamsTab, number>>>({});
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  // each page keeps its own scroll offset, as in the app's pager
  useLayoutEffect(() => {
    window.scrollTo(0, scrollOffsets.current[tab] ?? 0);
  }, [tab]);

  // tabs and filters change the page in place, as the app's pager and filters do
  const setSearchParams = (patch: Partial<ExamsSearch>) =>
    void navigate({
      search: (previous) => ({ ...previous, ...patch }),
      replace: true,
      resetScroll: false,
    });
  const selectTab = (next: ExamsTab) => {
    scrollOffsets.current[tab] = window.scrollY;
    setSearchParams({ tab: next === 'reviews' ? undefined : next });
  };
  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    swipeStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const handleTouchEnd = (event: TouchEvent) => {
    const start = swipeStart.current;
    const touch = event.changedTouches[0];
    swipeStart.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const next = phoneTabs[phoneTabs.indexOf(tab) + (dx < 0 ? 1 : -1)];
    if (next) selectTab(next);
  };
  const searchPlaceholder = t(
    tab === 'professors'
      ? 'app.searchProfessors'
      : tab === 'mine'
        ? 'study.searchMyMaterials'
        : 'app.searchCourses',
  );
  const handleSearchOpen = () => {
    setSearch(tab === 'professors' ? professorQuery : query);
    setIsSearching(true);
  };
  const handleSearchClose = () => setIsSearching(false);
  const handleSearchSubmit = () => {
    if (tab === 'professors') setProfessorQuery(search.trim());
    else setQuery(search.trim());
  };
  const handleFiltersOpen = () => setIsFiltersOpen(true);
  const handleUniversityChange = (value: string | undefined) =>
    setSearchParams({ university: value });
  const handleSemesterChange = (value: number | undefined) => setSearchParams({ semester: value });
  // a course lives in the student's study programme, so without one the form can't be filled in
  const handleAdd = () => {
    if (!profile) return;
    if (!profile.programmes?.length) {
      toast.error(
        <span>
          <strong className="block">{t('study.noProgrammeTitle')}</strong>
          {t('study.noProgrammeDescription')}
        </span>,
      );
      return;
    }
    void navigate({
      to: '/exams/courses/new',
      search: (previous) => ({ ...previous, tab: 'reviews' }),
      resetScroll: false,
    });
  };
  const handleProfessorClose = () =>
    goBack({
      to: '/exams',
      search: (previous) => ({ ...previous, professor: undefined }),
      resetScroll: false,
    });
  const tabLabels = {
    reviews: t('study.tabCourses'),
    professors: t('study.tabProfessors'),
    mine: t('study.tabMyMaterials'),
  };

  return (
    <>
      <UITopbar
        sticky
        compact={isHeaderCompact}
        title={t('tabs.exams')}
        actions={[
          { label: searchPlaceholder, icon: Search, onClick: handleSearchOpen },
          { label: t('study.filters'), icon: SlidersHorizontal, onClick: handleFiltersOpen },
          { label: t('study.addCourse'), icon: Plus, onClick: handleAdd },
        ]}
      >
        <UISubTabs
          tabs={phoneTabs.map((id) => ({ id, label: tabLabels[id] }))}
          value={tab}
          onChange={selectTab}
          label={t('tabs.exams')}
          idPrefix="exams"
          className="-mx-4 w-[calc(100%+2rem)] gap-0 px-4"
        />
      </UITopbar>
      <div
        id="exams-tab-panel"
        role="tabpanel"
        aria-labelledby={`exams-tab-${tab}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="min-h-[60svh]"
      >
        {/* every page stays mounted, so its list and paging survive a tab switch */}
        <div hidden={tab !== 'reviews'}>
          <CoursesPhonePage query={query} universityId={university} semester={semester} />
        </div>
        <div hidden={tab !== 'professors'}>
          <ProfessorsPhonePage query={professorQuery} universityId={university} />
        </div>
        <div hidden={tab !== 'mine'}>
          <FilesPhonePage query={query} universityId={university} semester={semester} />
        </div>
      </div>
      <UISearchOverlay
        isOpen={isSearching}
        value={search}
        onChangeText={setSearch}
        onSubmit={handleSearchSubmit}
        onClose={handleSearchClose}
        placeholder={searchPlaceholder}
        submitLabel={t('topbar.search')}
      />
      <StudyFiltersSheet
        isOpen={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        universityId={university}
        semester={semester}
        showSemester={tab !== 'professors'}
        onUniversityChange={handleUniversityChange}
        onSemesterChange={handleSemesterChange}
      />
      {professor && <ProfessorPhoneScreen professorId={professor} onClose={handleProfessorClose} />}
      <Outlet />
    </>
  );
}
