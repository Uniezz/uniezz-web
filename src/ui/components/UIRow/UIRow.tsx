import { cn } from '@/ui/cn';
import { UIText } from '../UIText';
import { rowstyles } from './variants';
import { VariantProps } from 'class-variance-authority';
import { UICheckbox } from '../UICheckbox';

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
    >
      <div className="flex min-w-0 flex-1 flex-row items-center gap-3.5 [@media(max-height:800px)]:gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue [@media(max-height:800px)]:h-7 [@media(max-height:800px)]:w-7 [@media(max-height:800px)]:rounded-lg">
          <UIText
            weight="bold"
            color="white"
            size="sm"
            className="[@media(max-height:800px)]:text-[11px]"
          >
            {iconText}
          </UIText>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start [@media(max-height:800px)]:flex-row [@media(max-height:800px)]:items-center [@media(max-height:800px)]:gap-2">
          <UIText weight="semibold" color="primary" className="max-w-full truncate text-left">
            {topText}
          </UIText>
          <UIText
            color="gray"
            size="sm"
            className="shrink-0 [@media(max-height:800px)]:text-[11px]"
          >
            {bottomText}
          </UIText>
        </div>
      </div>

      <UICheckbox checked={selected!} className="shrink-0" />
    </button>
  );
};
