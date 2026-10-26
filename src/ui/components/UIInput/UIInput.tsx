import { type LucideIcon } from 'lucide-react';
import { type ComponentProps, useId } from 'react';
import { cn } from '../../cn';
import { UIText } from '../UIText';
import { inputStyles } from './variants';

type UIInputProps = Omit<ComponentProps<'input'>, 'value' | 'onChange'> & {
  text: string;
  onTextChange?: (newValue: string) => void;
  errorText?: string;
  label?: string;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  isDisabled?: boolean;
};

export const UIInput = ({
  errorText,
  text,
  onTextChange,
  iconLeft: IconLeft,
  iconRight: IconRight,
  isDisabled,
  placeholder,
  label,
  id,
  className,
  type = 'text',
  ...props
}: UIInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const isErrorPresent = Boolean(errorText);

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <UIText as="label" htmlFor={inputId} size="sm" weight="semibold">
          {label}
        </UIText>
      ) : null}

      <div className={cn(inputStyles({ error: isErrorPresent }), className)}>
        {IconLeft ? <IconLeft className="text-muted" size={18} /> : null}

        <input
          {...props}
          id={inputId}
          className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-muted"
          type={type}
          value={text}
          onChange={(e) => onTextChange?.(e.target.value)}
          disabled={isDisabled}
          placeholder={placeholder}
          aria-invalid={isErrorPresent || undefined}
          aria-describedby={isErrorPresent ? errorId : undefined}
        />

        {IconRight ? <IconRight className="text-muted" size={18} /> : null}
      </div>

      {isErrorPresent ? (
        <UIText as="p" id={errorId} color="error" className="pl-2">
          {errorText}
        </UIText>
      ) : null}
    </div>
  );
};
