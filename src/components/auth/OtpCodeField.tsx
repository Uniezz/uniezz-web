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
      <div className="relative flex w-full gap-2.5 max-lg:gap-2">
        {Array.from({ length: cellCount }, (_, index) => {
          const digit = digits[index] ?? '';
          const isFocused =
            value.length === index || (value.length === cellCount && index === cellCount - 1);
          const isEntered = digit.length > 0;

          return (
            <div
              key={index}
              className={cn(
                // on a phone, the mobile app's cells: 58 high, 26px, white 3% fill, sky focus
                'flex h-14 min-w-0 flex-1 items-center justify-center rounded-xl border bg-white/5 text-xl font-semibold text-white max-lg:h-14.5 max-lg:bg-white-3 max-lg:text-[26px]',
                isFocused
                  ? 'border-white/60 max-lg:border-[1.5px] max-lg:border-sky'
                  : 'border-white/10 max-lg:border-white-12',
                isEntered ? 'bg-white/10 max-lg:bg-white-3' : '',
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
          autoComplete="off"
          autoFocus
          aria-label={t('auth.otp.codeLabel')}
          aria-invalid={Boolean(errorText) || undefined}
          aria-describedby={errorText ? errorId : undefined}
        />
      </div>
      {/* Always rendered so an error appearing doesn't shift the layout. */}
      <UIText
        as="p"
        id={errorId}
        color="error"
        className="min-h-lh pl-2 max-lg:pl-0 max-lg:text-sm max-lg:font-semibold"
      >
        {errorText}
      </UIText>
    </div>
  );
};
