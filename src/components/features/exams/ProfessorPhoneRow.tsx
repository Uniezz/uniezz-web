import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Professor } from '@/@types';
import { useRateProfessor } from '@/hooks';
import { apiErrorKey, toast } from '@/utils';
import { cn } from '@/ui/cn';
import { StudyRatingRow } from './StudyRatingRow';

export type ProfessorPhoneRowProps = {
  professor: Professor;
  /** Opens the professor; left out on the professor's own screen. */
  onOpen?: (id: string) => void;
};

/** The mobile app's ProfessorRow: name, degree and university, then the ratings. */
export const ProfessorPhoneRow = memo(function ProfessorPhoneRow({
  professor,
  onOpen,
}: ProfessorPhoneRowProps) {
  const { t } = useTranslation();
  const { mutate: rate, isPending: isRating, variables } = useRateProfessor();
  const handleRate = (rating: number) =>
    rate({ id: professor.id, rating }, { onError: (error) => toast.error(t(apiErrorKey(error))) });
  const handleOpen = () => onOpen?.(professor.id);
  const text = (
    <>
      <span className="truncate text-body leading-5 font-semibold">{professor.name}</span>
      <span className="truncate text-micro text-secondary">
        {[professor.degree, professor.universityId.toUpperCase()].filter(Boolean).join(' · ')}
      </span>
    </>
  );
  const Root = onOpen ? 'li' : 'div';
  return (
    <Root className="relative flex flex-col gap-2.5 rounded-2xl p-3 glass">
      {onOpen ? (
        <button
          type="button"
          onClick={handleOpen}
          data-ph-capture-attribute-label="Open professor reviews"
          className={cn(
            'flex min-w-0 flex-col gap-0.75 text-left after:absolute after:inset-0 after:rounded-2xl',
            'focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-blue',
          )}
        >
          {text}
        </button>
      ) : (
        <div className="flex min-w-0 flex-col gap-0.75">{text}</div>
      )}
      <StudyRatingRow
        average={professor.ratingAverage}
        count={professor.ratingCount}
        myRating={
          isRating && variables?.id === professor.id ? variables.rating : professor.myRating
        }
        disabled={isRating}
        analyticsLabel="Rate professor"
        onRate={handleRate}
      />
    </Root>
  );
});
