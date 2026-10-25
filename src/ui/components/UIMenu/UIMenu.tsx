import { Check } from 'lucide-react';
import { type Option } from '@/@types';
import { UIButton } from '../UIButton';
import { menuOptionStyles, menuStyles } from './variants';

type UIMenuProps = {
  options: Option[];
  value: string;
  onSelect: (value: string) => void;
};

export const UIMenu = ({ options, value, onSelect }: UIMenuProps) => (
  <div className={menuStyles()}>
    {options.map((option) => {
      const isActive = option.value === value;

      return (
        <UIButton
          key={option.value}
          size="md"
          bg="transparent"
          aria-current={isActive}
          className={menuOptionStyles({ active: isActive })}
          onClick={() => onSelect(option.value)}
        >
          <option.Icon className="h-4 w-6 shrink-0 rounded-xs" />
          <span className="flex-1 text-left">{option.label}</span>
          {isActive ? <Check className="text-blue-light" size={16} /> : null}
        </UIButton>
      );
    })}
  </div>
);
