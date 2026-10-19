import { otpDefaultValues, otpSchema, type OtpSchema } from '@/schemas';
import { CELL_COUNT, OTP_RESEND_SECONDS } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

export const useOtpScreen = () => {
  const navigate = useNavigate();
  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: otpDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = form;

  const step = useWatch({ control, name: 'step' });
  const email = useWatch({ control, name: 'email' });
  const code = useWatch({ control, name: 'code' });
  const isEmailStep = step === 'email';

  const [resendSeconds, setResendSeconds] = useState(0);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  useEffect(() => {
    if (isEmailStep) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setResendSeconds((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isEmailStep, email]);

  const onEmailChange = (value: string) => {
    setValue('email', value, {
      shouldValidate: isSubmitted && isEmailStep,
    });
  };

  const onCodeChange = (value: string) => {
    setValue('code', value.replace(/\D/g, '').slice(0, CELL_COUNT), {
      shouldValidate: isSubmitted && !isEmailStep,
    });
  };

  const onButtonPress = handleSubmit((data) => {
    if (data.step === 'email') {
      setAvailabilityError(
        'Email sign-in is not available yet. Please use UMCS USOS if you have a UMCS account.',
      );
      return;
    }

    // TODO: POST /auth/callback/otp then enter the app
  });

  const onBackPress = () => {
    if (!isEmailStep) {
      setValue('step', 'email');
      setValue('code', '');
      return;
    }

    navigate({ to: '/login' });
  };

  const onResendPress = () => {
    if (resendSeconds > 0) {
      return;
    }

    // TODO: POST /auth/start
    setResendSeconds(OTP_RESEND_SECONDS);
  };

  const topText = isEmailStep ? 'Provide your university email' : 'Check your university inbox';
  const bottomText = isEmailStep
    ? 'We’ll send a six-digit code to this inbox. Use the address your university issued.'
    : `We sent a six-digit code to ${email}. It expires in 10 minutes.`;
  const buttonText = isEmailStep ? 'Send code' : 'Verify and continue';
  const isButtonDisabled = !isEmailStep && code.length !== CELL_COUNT;
  const resendLabel =
    resendSeconds > 0 ? `Resend in 0:${String(resendSeconds).padStart(2, '0')}` : 'Resend code';

  return {
    email,
    onEmailChange,
    emailError: errors.email?.message,
    availabilityError,
    emailPlaceholder: 'you@university.edu',
    code,
    onCodeChange,
    codeError: errors.code?.message,
    onButtonPress,
    onBackPress,
    onResendPress,
    cellCount: CELL_COUNT,
    topText,
    bottomText,
    buttonText,
    isEmailStep,
    isButtonDisabled,
    resendSeconds,
    resendLabel,
    canResend: resendSeconds === 0,
  };
};
