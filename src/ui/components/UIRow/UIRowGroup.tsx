import { type ReactNode } from 'react';
import { cn } from '../../cn';
import { rowGroupStyles } from './variants';

export type UIRowGroupProps = {
  /** `UIRow`s with `appearance="inset"`, as direct children so the last one drops its divider. */
  children: ReactNode;
  label: string;
  className?: string;
};

export const UIRowGroup = ({ children, label, className }: UIRowGroupProps) => (
  <div role="group" aria-label={label} className={cn(rowGroupStyles(), className)}>
    {children}
  </div>
);
