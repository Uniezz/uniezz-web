import { AuthPage, OtpCodeField } from '@/components';
import { useOtpScreen } from '@/hooks';
import { UIButton, UIInput, UIText } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, AtSign, Check, Mail, Send, TriangleAlert } from 'lucide-react';

export const Route = createFileRoute('/(auth)/otp')({
  component: OtpPage,
});

function OtpPage() {
  const {
    email,
    onEmailChange,
    emailError,
    availabilityError,
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
  } = useOtpScreen();

  const ButtonIcon = isEmailStep ? Send : Check;

  return (
    <AuthPage
      topText={topText}
      bottomText={bottomText}
      beforeTitle={
        <button type="button" onClick={onBackPress} className="flex items-center gap-2 self-start">
          <ArrowLeft size={16} className="text-secondary" />
          <UIText weight="semibold" color="secondary">
            Back to universities
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
        {availabilityError ? (
          <p role="alert" className="text-red-600 text-sm">
            {availabilityError}
          </p>
        ) : null}
        {isEmailStep ? (
          <UIInput
            type="email"
            autoComplete="email"
            autoFocus
            iconLeft={AtSign}
            label="Email"
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
                Didn&apos;t get it?
              </UIText>
              <button type="button" onClick={onResendPress}>
                <UIText size="sm" color="primary" weight="semibold">
                  Resend code
                </UIText>
              </button>
              <UIText size="sm" color="gray" className="ml-auto">
                3 codes per hour
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
              Email sign-in confirms your university domain only. Faculty and year of study stay
              self-declared until your account is linked to USOS or your university directory.
            </UIText>
          </div>
        )}
      </form>
    </AuthPage>
  );
}
