import { cn } from '@/ui/cn';
import { UIText } from '../UIText';
import { rowstyles } from './variants';
import { VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';

type UIRowProps = VariantProps<typeof rowstyles> & {
  iconText: string;
  topText: string;
  fullName: string;
  bottomText: string;
  onClick: () => void;
};

export const UIRow = ({
  iconText,
  topText,
  fullName,
  bottomText,
  onClick,
  selected,
}: UIRowProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(rowstyles({ selected }))}
      title={fullName}
      aria-label={`${fullName}, ${bottomText}`}
      aria-pressed={Boolean(selected)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue/25">
          <UIText weight="bold" color="white" size="sm" className="text-caption">
            {iconText}
          </UIText>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <UIText weight="semibold" color="primary" className="max-w-full truncate text-left">
            {topText}
          </UIText>
          <UIText color="gray" size="sm" className="max-w-full truncate text-left text-xs">
            {fullName}
          </UIText>
        </div>
      </div>
      <UIText color="gray" size="sm" className="shrink-0 text-xs">
        {bottomText}
      </UIText>

      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-white bg-white text-ink' : 'border-white/30',
        )}
        aria-hidden
      >
        {selected ? <Check size={12} /> : null}
      </span>
    </button>
  );
};
