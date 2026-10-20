import { UIText } from '@/ui/components';
import { cn } from '@/ui/cn';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

type OtpCodeFieldProps = {
  value: string;
  onChange: (value: string) => void;
  cellCount: number;
  errorText?: string;
};

export const OtpCodeField = ({ value, onChange, cellCount, errorText }: OtpCodeFieldProps) => {
  const { t } = useTranslation();
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const digits = value.split('');

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex w-full gap-2.5">
        {Array.from({ length: cellCount }, (_, index) => {
          const digit = digits[index] ?? '';
          const isFocused =
            value.length === index || (value.length === cellCount && index === cellCount - 1);
          const isEntered = digit.length > 0;

          return (
            <div
              key={index}
              className={cn(
                'flex h-15.5 flex-1 items-center justify-center rounded-xl border text-2xl font-bold',
                isFocused ? 'border-blue-light' : 'border-gray',
                isEntered ? 'bg-transparent text-primary' : 'bg-blue-soft text-primary',
              )}
            >
              {digit}
            </div>
          );
        })}
        <input
          id={inputId}
          className="absolute inset-0 cursor-text opacity-0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          aria-label={t('auth.otp.codeLabel')}
          aria-invalid={Boolean(errorText) || undefined}
          aria-describedby={errorText ? errorId : undefined}
        />
      </div>
      {errorText ? (
        <UIText as="p" id={errorId} color="error" className="pl-2">
          {errorText}
        </UIText>
      ) : null}
    </div>
  );
};
