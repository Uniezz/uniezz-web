import { useId } from 'react';
import { cn } from '../../cn';
import { switchRowStyles, switchLabelStyles, switchStyles, switchThumbStyles } from './variants';

export type UISwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  className?: string;
};
export const UISwitch = ({ checked, onChange, label, className }: UISwitchProps) => {
  const id = useId();
  return (
    <div className={cn(switchRowStyles(), className)}>
      <span id={id} className={switchLabelStyles()}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
        className={switchStyles({ checked })}
      >
        <span className={switchThumbStyles()} />
      </button>
    </div>
  );
};
