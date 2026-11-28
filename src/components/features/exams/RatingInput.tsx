import { Star, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/ui/cn';

type RatingInputBaseProps = {
  average: number;
  count: number;
  ariaLabel?: string;
  icon?: LucideIcon;
};

export type RatingInputProps = RatingInputBaseProps &
  (
    | { readOnly: true; analyticsLabel?: never; disabled?: never; onRate?: never }
    | {
        readOnly?: false;
        /** Fixed analytics description; never user content. */
        analyticsLabel: string;
        disabled?: boolean;
        /** The signed-in student's own rating; only it fills the stars, the average shows in the summary. */
        myRating: number | null;
        showSummary?: boolean;
        /** The mobile app's sizes: `compact` 20px stars, `large` 28px; neither has a summary or hover growth. */
        size?: 'compact' | 'large';
        onRate: (rating: number) => void;
      }
  );

export function RatingInput(props: RatingInputProps) {
  const { t } = useTranslation();
  const Icon = props.icon ?? Star;
  return (
    <div className="flex items-center gap-2">
      <div
        role={props.readOnly ? 'img' : 'group'}
        aria-label={
          props.ariaLabel ??
          (props.readOnly ? t('exams.difficulty', { difficulty: props.average }) : t('app.rating'))
        }
        className="flex"
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = props.readOnly ? props.average : (props.myRating ?? 0);
          const size = props.readOnly ? undefined : props.size;
          const compact = size !== undefined;
          const className = cn(
            value <= Math.round(filled)
              ? 'fill-warning text-warning'
              : compact
                ? 'text-white-20'
                : 'text-white-40',
            !props.readOnly &&
              !compact &&
              'transition-transform group-enabled:group-hover:scale-125',
          );
          if (props.readOnly) {
            return <Icon key={value} size={14} aria-hidden="true" className={className} />;
          }
          return (
            <button
              key={value}
              type="button"
              disabled={props.disabled}
              aria-label={t('exams.rate', { value })}
              aria-pressed={props.myRating === value}
              data-ph-capture-attribute-label={`${props.analyticsLabel} ${value} of 5`}
              onClick={() => props.onRate(value)}
              className={cn(
                'group rounded-full focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-50',
                compact ? 'mx-0.5' : 'p-1',
              )}
            >
              <Icon
                size={size === 'large' ? 28 : size === 'compact' ? 20 : 14}
                aria-hidden="true"
                className={className}
              />
            </button>
          );
        })}
      </div>
      {!props.readOnly && props.showSummary !== false && !props.size && (
        <span className="text-label font-semibold">
          {props.count > 0 ? props.average.toFixed(1) : '—'}{' '}
          <span className="text-muted">({props.count})</span>
        </span>
      )}
    </div>
  );
}
