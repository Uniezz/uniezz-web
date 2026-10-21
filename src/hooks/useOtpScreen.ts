import { otpDefaultValues, otpSchema, type OtpSchema } from '@/schemas';
import { CELL_COUNT } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm, useWatch } from 'react-hook-form';

const OTP_UNAVAILABLE_MESSAGE =
  'Email sign-in is not available yet. Please use UMCS USOS if you have a UMCS account.';

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
    setError,
    clearErrors,
    formState: { errors, isSubmitted },
  } = form;

  const step = useWatch({ control, name: 'step' });
  const email = useWatch({ control, name: 'email' });
  const code = useWatch({ control, name: 'code' });
  const isEmailStep = step === 'email';

  const onEmailChange = (value: string) => {
    clearErrors('root');
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
      setError('root', { type: 'unavailable', message: OTP_UNAVAILABLE_MESSAGE });
      return;
    }

    // TODO: POST /auth/callback/otp then enter the app
  });

  const onBackPress = () => {
    if (!isEmailStep) {
      clearErrors('root');
      setValue('step', 'email');
      setValue('code', '');
      return;
    }

    navigate({ to: '/login' });
  };

  const onResendPress = () => {
    setError('root', { type: 'unavailable', message: OTP_UNAVAILABLE_MESSAGE });
  };

  const topText = isEmailStep ? 'Provide your university email' : 'Check your university inbox';
  const bottomText = isEmailStep
    ? 'We’ll send a six-digit code to this inbox. Use the address your university issued.'
    : `We sent a six-digit code to ${email}. It expires in 10 minutes.`;
  const buttonText = isEmailStep ? 'Send code' : 'Verify and continue';
  const isButtonDisabled = !isEmailStep && code.length !== CELL_COUNT;

  return {
    email,
    onEmailChange,
    emailError: errors.email?.message,
    availabilityError: errors.root?.message,
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
  };
};
