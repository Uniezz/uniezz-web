import { AuthPage, OtpCodeField } from '@/components';
import { useOtpScreen, usePhoneViewport } from '@/hooks';
import { UIButton, UIInput, UIText } from '@/ui/components';
import { cn } from '@/ui/cn';
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
  const isPhone = usePhoneViewport();

  return (
    <AuthPage
      topText={topText}
      bottomText={bottomText}
      beforeTitle={
        <button
          type="button"
          data-ph-capture-attribute-label={
            isEmailStep ? t('auth.backToUniversities') : t('auth.otp.changeEmail')
          }
          onClick={onBackPress}
          // on a phone, the mobile app's ghost button right under Send code; the code step uses the email pill's Change
          className={cn(
            'flex items-center gap-2 self-start rounded text-secondary outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-blue max-lg:order-last max-lg:-mt-5 max-lg:min-h-14 max-lg:justify-center max-lg:self-stretch',
            !isEmailStep && 'max-lg:hidden',
          )}
        >
          <ArrowLeft size={16} />
          <UIText weight="semibold" size="sm" className="max-lg:text-body">
            {isEmailStep ? t('auth.backToUniversities') : t('auth.otp.changeEmail')}
          </UIText>
        </button>
      }
      headingIcon={
        isEmailStep ? undefined : (
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 max-lg:hidden">
            <Mail size={20} className="text-white" />
          </div>
        )
      }
    >
      <form className="flex flex-col gap-6 max-lg:gap-4" onSubmit={onButtonPress}>
        {isEmailStep ? (
          <UIInput
            type="email"
            autoComplete="email"
            autoFocus
            iconLeft={isPhone ? Mail : AtSign}
            label={t('auth.otp.emailLabel')}
            placeholder={emailPlaceholder}
            text={email}
            onTextChange={onEmailChange}
            errorText={emailError}
            reserveErrorSpace
          />
        ) : (
          <div className="flex flex-col gap-3 max-lg:gap-4">
            {/* the mobile app's email pill: the address and Change, in place of the back button */}
            <div className="flex items-center gap-2.5 rounded-xl border border-white-12 bg-white-3 py-2.75 pr-2 pl-3.5 lg:hidden">
              <Mail size={17} aria-hidden className="shrink-0 text-white-60" />
              <UIText className="min-w-0 flex-1 truncate">{email}</UIText>
              <button
                type="button"
                data-ph-capture-attribute-label="Change email"
                onClick={onBackPress}
                className="shrink-0 rounded px-2 py-1 text-label font-semibold text-sky outline-none focus-visible:ring-2 focus-visible:ring-blue"
              >
                {t('auth.otp.change')}
              </button>
            </div>
            <OtpCodeField
              value={code}
              onChange={onCodeChange}
              cellCount={cellCount}
              errorText={codeError}
            />
            <div className="flex flex-wrap items-center gap-2 max-lg:hidden">
              <UIText size="sm" color="gray">
                {t('auth.otp.didntGetIt')}
              </UIText>
              <button
                type="button"
                data-ph-capture-attribute-label={t('auth.otp.resend')}
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
          className={cn(
            'w-full max-lg:min-h-14 max-lg:rounded-[14px]',
            // the mobile app's Verify code has no icon
            !isEmailStep && 'max-lg:[&>svg:first-child]:hidden',
          )}
          bg="gradient"
          leftIcon={ButtonIcon}
          type="submit"
          disabled={isButtonDisabled}
        >
          <UIText
            weight="semibold"
            className="text-ink max-lg:min-w-0 max-lg:text-center max-lg:text-section"
          >
            {buttonText}
          </UIText>
        </UIButton>
        {isEmailStep ? null : (
          // the mobile app's centred resend line under the button
          <div className="-mt-0.5 flex flex-wrap justify-center gap-1 pb-2 lg:hidden">
            <UIText size="sm" color="secondary">
              {t('auth.otp.didntGetIt')}
            </UIText>
            <button
              type="button"
              data-ph-capture-attribute-label={t('auth.otp.resend')}
              onClick={onResendPress}
              disabled={isPending}
              className="rounded text-sm font-semibold text-sky outline-none focus-visible:ring-2 focus-visible:ring-blue disabled:opacity-40"
            >
              {t('auth.otp.resend')}
            </button>
          </div>
        )}
        {isEmailStep ? null : (
          <div className="flex flex-row items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 max-lg:hidden">
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
