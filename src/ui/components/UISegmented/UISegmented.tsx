import { type ReactNode } from 'react';
import { UIButton } from '../UIButton';
import { segmentedStyles } from './variants';

export type UISegmentedProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** Icons shown before an option's label, keyed by the option. */
  icons?: Partial<Record<string, ReactNode>>;
};
export const UISegmented = ({ options, value, onChange, label, icons }: UISegmentedProps) => {
  return (
    <div role="group" aria-label={label} className={segmentedStyles()}>
      {options.map((option) => (
        <UIButton
          key={option}
          size="pill"
          bg={value === option ? 'primary' : 'secondary'}
          aria-pressed={value === option}
          className={icons?.[option] ? 'gap-1.5' : undefined}
          onClick={() => onChange(option)}
        >
          {icons?.[option]}
          {option}
        </UIButton>
      ))}
    </div>
  );
};
