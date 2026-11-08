import { type VariantProps } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import { tagStyles } from './variants';

export type UITagProps = VariantProps<typeof tagStyles> & ComponentProps<'span'>;

export const UITag = ({ color, className, ...props }: UITagProps) => {
  return <span className={cn(tagStyles({ color }), className)} {...props} />;
};
