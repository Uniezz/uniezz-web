import { AuthPage, OtpCodeField } from '@/components';
import { useOtpScreen } from '@/hooks';
import { UIButton, UIInput, UIText } from '@/ui/components';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { ArrowLeft, AtSign, Check, LockKeyhole, Mail, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(auth)/otp')({
  validateSearch: (search) => ({
    university: typeof search.university === 'string' ? search.university : '',
  }),
  beforeLoad: ({ search }) => {
    if (!search.university) throw redirect({ to: '/login' });
  },
  component: OtpPage,
});

function OtpPage() {
  const { t } = useTranslation();
  const { university } = Route.useSearch();
  const {
    email,
    onEmailChange,
    emailError,
    emailPlaceholder,
    code,
    onCodeChange,
    codeError,
    onButtonPress,
    onBackPress,
    onResendPress,
    cellCount,
    topText,
    bottomText,
    buttonText,
    isEmailStep,
    isButtonDisabled,
    isPending,
  } = useOtpScreen(university);

  const ButtonIcon = isEmailStep ? Send : Check;

  return (
    <AuthPage
      topText={topText}
      bottomText={bottomText}
      beforeTitle={
        <button
          type="button"
          onClick={onBackPress}
          className="flex items-center gap-2 self-start rounded text-secondary outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-blue"
        >
          <ArrowLeft size={16} />
          <UIText weight="semibold" size="sm">
            {isEmailStep ? t('auth.backToUniversities') : t('auth.otp.changeEmail')}
          </UIText>
        </button>
      }
      headingIcon={
        isEmailStep ? undefined : (
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Mail size={20} className="text-white" />
          </div>
        )
      }
    >
      <form className="flex flex-col gap-6" onSubmit={onButtonPress}>
        {isEmailStep ? (
          <UIInput
            type="email"
            autoComplete="email"
            autoFocus
            iconLeft={AtSign}
            label={t('auth.otp.emailLabel')}
            placeholder={emailPlaceholder}
            text={email}
            onTextChange={onEmailChange}
            errorText={emailError}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <OtpCodeField
              value={code}
              onChange={onCodeChange}
              cellCount={cellCount}
              errorText={codeError}
            />
            <div className="flex flex-wrap items-center gap-2">
              <UIText size="sm" color="gray">
                {t('auth.otp.didntGetIt')}
              </UIText>
              <button
                type="button"
                onClick={onResendPress}
                disabled={isPending}
                className="rounded text-periwinkle outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-blue disabled:opacity-40"
              >
                <UIText size="sm" weight="semibold">
                  {t('auth.otp.resend')}
                </UIText>
              </button>
              <UIText size="sm" color="gray" className="ml-auto">
                {t('auth.otp.codesPerHour')}
              </UIText>
            </div>
          </div>
        )}
        <UIButton
          className="w-full"
          bg="gradient"
          leftIcon={ButtonIcon}
          type="submit"
          disabled={isButtonDisabled}
        >
          <UIText weight="semibold" className="text-ink">
            {buttonText}
          </UIText>
        </UIButton>
        {isEmailStep ? null : (
          <div className="flex flex-row items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <LockKeyhole className="shrink-0 text-secondary" size={18} />
            <UIText size="sm" color="secondary" className="min-w-0 text-xs leading-5">
              {t('auth.otp.notice')}
            </UIText>
          </div>
        )}
      </form>
    </AuthPage>
  );
}
