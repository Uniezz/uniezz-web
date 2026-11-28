import { type LucideIcon, X } from 'lucide-react';
import { type ComponentProps, useId } from 'react';
import { cn } from '../../cn';
import { UIText } from '../UIText';
import { inputStyles } from './variants';

export type UIInputProps = Omit<ComponentProps<'input'>, 'value' | 'onChange'> & {
  text: string;
  onTextChange?: (newValue: string) => void;
  errorText?: string;
  label?: string;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  clearButton?: { label: string; onClear: VoidFunction };
  isDisabled?: boolean;
  /** Keeps one line under the input so an error appearing doesn't shift the layout. */
  reserveErrorSpace?: boolean;
};

export const UIInput = ({
  errorText,
  text,
  onTextChange,
  iconLeft: IconLeft,
  iconRight: IconRight,
  clearButton,
  isDisabled,
  reserveErrorSpace,
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
    <div className="flex flex-col gap-2 max-lg:gap-1.5">
      {label ? (
        // on a phone, the mobile app's caption: 12 semibold secondary
        <UIText
          as="label"
          htmlFor={inputId}
          size="sm"
          weight="semibold"
          className="max-lg:text-micro max-lg:text-secondary"
        >
          {label}
        </UIText>
      ) : null}

      <div className={cn(inputStyles({ error: isErrorPresent }), className)}>
        {IconLeft ? (
          <IconLeft className="text-muted max-lg:size-4.25 max-lg:text-white-60" size={18} />
        ) : null}

        <input
          {...props}
          id={inputId}
          autoComplete={props.autoComplete ?? 'off'}
          className={`min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-muted ${type === 'search' ? '[&::-webkit-search-cancel-button]:hidden' : ''}`}
          type={type}
          value={text}
          onChange={(e) => onTextChange?.(e.target.value)}
          disabled={isDisabled}
          placeholder={placeholder}
          aria-invalid={isErrorPresent || undefined}
          aria-describedby={isErrorPresent ? errorId : undefined}
        />

        {clearButton && text ? (
          <button
            type="button"
            data-ph-capture-attribute-label={clearButton.label}
            aria-label={clearButton.label}
            onClick={clearButton.onClear}
            className="flex size-6 shrink-0 items-center justify-center text-danger"
          >
            <X size={14} />
          </button>
        ) : IconRight ? (
          <IconRight className="text-muted" size={18} />
        ) : null}
      </div>

      {isErrorPresent || reserveErrorSpace ? (
        <UIText
          as="p"
          id={errorId}
          color="error"
          className="min-h-lh pl-2 max-lg:pl-0 max-lg:text-sm max-lg:font-semibold"
        >
          {errorText}
        </UIText>
      ) : null}
    </div>
  );
};
