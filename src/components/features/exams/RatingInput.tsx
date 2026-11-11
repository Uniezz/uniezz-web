import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/ui/cn';

export type RatingInputProps = {
  average: number;
  count: number;
  /** Fixed analytics description, e.g. "Rate course"; never the rated item's name. */
  analyticsLabel: string;
  disabled?: boolean;
  onRate: (rating: number) => void;
};

export function RatingInput({
  average,
  count,
  analyticsLabel,
  disabled = false,
  onRate,
}: RatingInputProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <div role="group" aria-label={t('app.rating')} className="flex">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={disabled}
            aria-label={t('exams.rate', { value })}
            data-ph-capture-attribute-label={`${analyticsLabel} ${value} of 5`}
            onClick={() => onRate(value)}
            className="group rounded-full p-1 focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-50"
          >
            <Star
              size={14}
              aria-hidden="true"
              className={cn(
                'transition-transform group-enabled:group-hover:scale-125',
                value <= Math.round(average) ? 'fill-warning text-warning' : 'text-white-40',
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-label font-semibold">
        {count > 0 ? average.toFixed(1) : '—'} <span className="text-muted">({count})</span>
      </span>
    </div>
  );
}
