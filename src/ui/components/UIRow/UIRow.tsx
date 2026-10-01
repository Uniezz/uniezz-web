import { cn } from '@/ui/cn';
import { UIText } from '../UIText';
import { rowstyles } from './variants';
import { VariantProps } from 'class-variance-authority';
import { UICheckbox } from '../UICheckbox';

type UIRowProps = VariantProps<typeof rowstyles> & {
  iconText: string;
  topText: string;
  bottomText: string;
  onClick: () => void;
};

export const UIRow = ({ iconText, topText, bottomText, onClick, selected }: UIRowProps) => {
  return (
    <button type="button" onClick={onClick} className={cn(rowstyles({ selected }))}>
      <div className="flex flex-row gap-3.5">
        <div className="flex h-9 w-9 items-center justify-center self-center rounded-xl bg-blue">
          <UIText weight={'bold'} color={'white'}>
            {iconText}
          </UIText>
        </div>
        <div className="flex flex-col items-start">
          <UIText weight={'semibold'} color={'primary'}>
            {topText}
          </UIText>
          <UIText color={'gray'} size={'sm'}>
            {bottomText}
          </UIText>
        </div>
      </div>

      <UICheckbox checked={selected!} />
    </button>
  );
};
