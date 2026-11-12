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
        showSummary?: boolean;
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
          const className = cn(
            value <= Math.round(props.average) ? 'fill-warning text-warning' : 'text-white-40',
            !props.readOnly && 'transition-transform group-enabled:group-hover:scale-125',
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
              data-ph-capture-attribute-label={`${props.analyticsLabel} ${value} of 5`}
              onClick={() => props.onRate(value)}
              className="group rounded-full p-1 focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-50"
            >
              <Icon size={14} aria-hidden="true" className={className} />
            </button>
          );
        })}
      </div>
      {!props.readOnly && props.showSummary !== false && (
        <span className="text-label font-semibold">
          {props.count > 0 ? props.average.toFixed(1) : '—'}{' '}
          <span className="text-muted">({props.count})</span>
        </span>
      )}
    </div>
  );
}
