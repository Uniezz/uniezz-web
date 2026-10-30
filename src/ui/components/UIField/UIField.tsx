import { type ReactNode } from 'react';
import { cn } from '../../cn';
import { fieldStyles, fieldErrorStyles } from './variants';

export type UIFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
};
export const UIField = ({ label, error, children, className }: UIFieldProps) => {
  return (
    <label className={cn(fieldStyles(), className)}>
      <span>{label}</span>
      {children}
      {error && (
        <span role="alert" className={fieldErrorStyles()}>
          {error}
        </span>
      )}
    </label>
  );
};
