import { UIButton } from '../UIButton';
import { segmentedStyles } from './variants';

export type UISegmentedProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
};
export const UISegmented = ({ options, value, onChange, label }: UISegmentedProps) => {
  return (
    <div role="group" aria-label={label} className={segmentedStyles()}>
      {options.map((option) => (
        <UIButton
          key={option}
          size="pill"
          bg={value === option ? 'primary' : 'secondary'}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </UIButton>
      ))}
    </div>
  );
};
