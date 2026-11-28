import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useProfessors } from '@/hooks';
import type { StudyPhonePageProps } from './CoursesPhonePage';
import { ProfessorPhoneRow } from './ProfessorPhoneRow';
import { StudyPhoneList } from './StudyPhoneList';

/** The mobile app's Professors page; a card opens the professor's screen. */
export function ProfessorsPhonePage({
  query,
  universityId,
}: Omit<StudyPhonePageProps, 'semester'>) {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: '/exams' });
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useProfessors({ universityId, q: query });
  const professors = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const handleOpen = (id: string) =>
    void navigate({ search: (previous) => ({ ...previous, professor: id }), resetScroll: false });
  return (
    <StudyPhoneList
      label={t('study.tabProfessors')}
      isPending={isPending}
      isError={isError}
      isEmpty={professors.length === 0}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      refetch={refetch}
    >
      {professors.map((professor) => (
        <ProfessorPhoneRow key={professor.id} professor={professor} onOpen={handleOpen} />
      ))}
    </StudyPhoneList>
  );
}
