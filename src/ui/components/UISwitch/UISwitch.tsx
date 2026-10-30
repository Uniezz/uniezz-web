import { useId } from 'react';
import { switchRowStyles, switchLabelStyles, switchStyles, switchThumbStyles } from './variants';

export type UISwitchProps = { checked: boolean; onChange: (value: boolean) => void; label: string };
export const UISwitch = ({ checked, onChange, label }: UISwitchProps) => {
  const id = useId();
  return (
    <div className={switchRowStyles()}>
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
