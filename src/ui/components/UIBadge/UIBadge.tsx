import { type VariantProps } from 'class-variance-authority';
import { type ReactNode } from 'react';
import { cn } from '../../cn';
import { badgeDotStyles, badgeStyles } from './variants';

export type UIBadgeProps = VariantProps<typeof badgeStyles> & {
  children: ReactNode;
  className?: string;
};

export const UIBadge = ({ variant, children, className }: UIBadgeProps) => {
  return (
    <span className={cn(badgeStyles({ variant }), className)}>
      {variant === 'warning' ? <span aria-hidden className={badgeDotStyles} /> : null}
      {children}
    </span>
  );
};
