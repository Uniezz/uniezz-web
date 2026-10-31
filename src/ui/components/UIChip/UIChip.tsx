import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import { chipStyles } from './variants';

export type UIChipProps = ComponentProps<'button'> & { selected?: boolean };
export const UIChip = ({ selected = false, className, ...props }: UIChipProps) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(chipStyles({ selected }), className)}
      {...props}
    />
  );
};
