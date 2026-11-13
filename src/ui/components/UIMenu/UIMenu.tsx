import { Check } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ComponentProps } from 'react';
import { type Option } from '@/@types';
import { cn } from '@/ui/cn';
import { UIButton } from '../UIButton';
import { UIUniversityLogo } from '../UIUniversityLogo';
import { menuIconStyles, menuOptionStyles, menuStyles } from './variants';

export type UIMenuProps = Omit<ComponentProps<'div'>, 'onSelect' | 'ref'> & {
  options: Option[];
  value: string;
  onSelect: (value: string) => void;
};

export const UIMenu = ({ options, value, onSelect, className, ...props }: UIMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [opensUp, setOpensUp] = useState(false);

  // Opens upward when the menu would run past the bottom of the viewport and fits above its trigger.
  useLayoutEffect(() => {
    const menu = ref.current;
    const trigger = menu?.parentElement;
    if (!menu || !trigger) return;
    const { bottom, height } = menu.getBoundingClientRect();
    setOpensUp(bottom > window.innerHeight && trigger.getBoundingClientRect().top > height);
  }, []);

  return (
    <div
      {...props}
      ref={ref}
      className={cn(menuStyles(), opensUp && 'top-auto bottom-full mt-0 mb-2', className)}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <UIButton
            key={option.value}
            size="md"
            bg="transparent"
            data-ph-capture-attribute-label={option.label}
            aria-current={isActive}
            className={menuOptionStyles({ active: isActive })}
            onClick={() => onSelect(option.value)}
          >
            {option.universityId ? (
              <UIUniversityLogo universityId={option.universityId} size="md" />
            ) : (
              option.Icon && (
                <span className={menuIconStyles({ active: isActive })} aria-hidden="true">
                  <option.Icon className="h-4 w-6 rounded-xs" />
                </span>
              )
            )}
            <span className="min-w-0 flex-1 text-left">
              <span className="block wrap-break-word">{option.label}</span>
              {option.description && (
                <span className="mt-0.5 block text-detail font-normal text-secondary">
                  {option.description}
                </span>
              )}
            </span>
            {isActive ? (
              <Check className="shrink-0 text-periwinkle" size={16} aria-hidden="true" />
            ) : null}
          </UIButton>
        );
      })}
    </div>
  );
};
