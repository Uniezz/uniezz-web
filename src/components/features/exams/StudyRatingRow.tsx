import { useTranslation } from 'react-i18next';
import { RatingInput } from './RatingInput';

export type StudyRatingRowProps = {
  average: number;
  count: number;
  myRating: number | null;
  disabled?: boolean;
  /** Fixed analytics description; never user content. */
  analyticsLabel: string;
  onRate: (rating: number) => void;
};

/** The mobile app's study row ratings: the average on the left, your stars on the right. */
export function StudyRatingRow({
  average,
  count,
  myRating,
  disabled,
  analyticsLabel,
  onRate,
}: StudyRatingRowProps) {
  const { t } = useTranslation();
  return (
    <div className="relative z-10 flex items-start justify-between gap-2 text-micro text-secondary">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span>{t('study.averageRating')}</span>
        {average > 0 ? (
          <span>
            <span className="text-amber">★</span>{' '}
            {t('study.ratingSummary', { rating: average.toFixed(1), votes: count })}
          </span>
        ) : (
          <span>{t('study.noRatings')}</span>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span>{t('study.yourRating')}</span>
        <RatingInput
          size="compact"
          average={average}
          count={count}
          myRating={myRating}
          disabled={disabled}
          analyticsLabel={analyticsLabel}
          onRate={onRate}
        />
      </div>
    </div>
  );
}
