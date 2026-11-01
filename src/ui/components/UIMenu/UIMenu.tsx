import { Check } from 'lucide-react';
import { type Option } from '@/@types';
import { cn } from '@/ui/cn';
import { UIButton } from '../UIButton';
import { menuOptionStyles, menuStyles } from './variants';

type UIMenuProps = {
  options: Option[];
  value: string;
  onSelect: (value: string) => void;
  className?: string;
};

export const UIMenu = ({ options, value, onSelect, className }: UIMenuProps) => (
  <div className={cn(menuStyles(), className)}>
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
          {isActive ? <Check className="text-periwinkle" size={16} /> : null}
        </UIButton>
      );
    })}
  </div>
);
