import { useTranslation } from 'react-i18next';
import type { Programme } from '@/@types';

export type ProgrammeSummaryCardProps = {
  /** An own programme, or one on a student's public profile. */
  programme: Pick<Programme, 'isPrimary' | 'modeOfStudies' | 'programme' | 'yearOfStudy'> & {
    faculty: string | null;
  };
};

/** The mobile app's read-only ProgrammeCard on a profile. */
export function ProgrammeSummaryCard({ programme }: ProgrammeSummaryCardProps) {
  const { t } = useTranslation();
  const mode =
    programme.modeOfStudies === 'full_time'
      ? t('app.modeOfStudiesFullTime')
      : programme.modeOfStudies === 'part_time'
        ? t('app.modeOfStudiesPartTime')
        : null;
  return (
    <article className="flex flex-col gap-3.5 rounded-[20px] border border-white/14 bg-white-3 bg-linear-to-b from-white-5 to-white-0 to-65% p-5">
      {programme.isPrimary && (
        <span className="text-micro font-medium text-secondary">{t('app.primary')}</span>
      )}
      <h3 className="text-[24px] leading-[1.2] font-semibold tracking-[-0.5px] wrap-anywhere">
        {programme.programme}
      </h3>
      {programme.faculty && (
        <p className="text-detail font-medium wrap-anywhere text-secondary">{programme.faculty}</p>
      )}
      {(programme.yearOfStudy || mode) && (
        <div className="flex items-center justify-between gap-2 border-t border-white/8 pt-3.5 text-detail">
          {programme.yearOfStudy && (
            <span className="font-semibold">
              {t('app.studyYear', { year: programme.yearOfStudy })}
            </span>
          )}
          {programme.yearOfStudy && mode && <span className="text-secondary">·</span>}
          {mode && <span className="font-medium text-secondary">{mode}</span>}
        </div>
      )}
    </article>
  );
}
