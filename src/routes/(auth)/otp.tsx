import { AuthPage, OtpCodeField } from '@/components';
import { useOtpScreen } from '@/hooks';
import { UIButton, UIInput, UIText } from '@/ui/components';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { ArrowLeft, AtSign, Check, Mail, Send, TriangleAlert } from 'lucide-react';
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
        <button type="button" onClick={onBackPress} className="flex items-center gap-2 self-start">
          <ArrowLeft size={16} className="text-secondary" />
          <UIText weight="semibold" color="secondary">
            {isEmailStep ? t('auth.backToUniversities') : t('auth.otp.changeEmail')}
          </UIText>
        </button>
      }
      headingIcon={
        isEmailStep ? undefined : (
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft">
            <Mail size={20} className="text-blue-light" />
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
            <div className="flex items-center gap-2">
              <UIText size="sm" color="gray">
                {t('auth.otp.didntGetIt')}
              </UIText>
              <button type="button" onClick={onResendPress} disabled={isPending}>
                <UIText size="sm" color="primary" weight="semibold">
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
          <UIText weight="semibold" color="white">
            {buttonText}
          </UIText>
        </UIButton>
        {isEmailStep ? null : (
          <div className="flex flex-row items-start gap-2.5 rounded-xl bg-ice px-4 py-3">
            <TriangleAlert className="text-blue" size={22} />
            <UIText size="sm" color="secondary" className="min-w-0">
              {t('auth.otp.notice')}
            </UIText>
          </div>
        )}
      </form>
    </AuthPage>
  );
}
