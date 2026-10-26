import { requestOtpCode, verifyOtpCode } from '@/api';
import { otpDefaultValues, otpSchema, type OtpSchema } from '@/schemas';
import { CELL_COUNT } from '@/utils';
import { saveSession } from '@/utils/session';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const useOtpScreen = (university: string) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: requestCode, isPending: isRequesting } = useMutation({
    mutationFn: requestOtpCode,
  });
  const { mutateAsync: verifyCode, isPending: isVerifying } = useMutation({
    mutationFn: verifyOtpCode,
  });
  const isPending = isRequesting || isVerifying;
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
    setValue('email', value, {
      shouldValidate: isSubmitted && isEmailStep,
    });
  };

  const onCodeChange = (value: string) => {
    setValue('code', value.replace(/\D/g, '').slice(0, CELL_COUNT), {
      shouldValidate: isSubmitted && !isEmailStep,
    });
  };

  const onButtonPress = handleSubmit(async (data) => {
    if (isPending) return;

    try {
      if (data.step === 'email') {
        await requestCode({ email: data.email, university });
        setValue('step', 'code');
        setValue('code', '');
      } else {
        const session = await verifyCode({ code: data.code, email: data.email, university });
        try {
          saveSession(session);
        } catch {
          throw new Error('Couldn’t save your session. Please sign in again.');
        }
        navigate({ to: '/feed', replace: true });
      }
    } catch (error) {
      setError(data.step, {
        message: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  });

  const onBackPress = () => {
    if (!isEmailStep) {
      clearErrors();
      setValue('step', 'email');
      setValue('code', '');
      return;
    }

    navigate({ to: '/login' });
  };

  const onResendPress = async () => {
    if (isPending) return;
    try {
      await requestCode({ email, university });
      clearErrors('code');
      setValue('code', '');
    } catch (error) {
      setError('code', { message: error instanceof Error ? error.message : 'Please try again.' });
    }
  };

  const topText = isEmailStep ? t('auth.otp.emailTitle') : t('auth.otp.codeTitle');
  const bottomText = isEmailStep
    ? t('auth.otp.emailSubtitle')
    : t('auth.otp.codeSubtitle', { email });
  const buttonText = isEmailStep ? t('auth.otp.send') : t('auth.otp.verify');
  const isButtonDisabled = isPending || (!isEmailStep && code.length !== CELL_COUNT);

  return {
    email,
    onEmailChange,
    emailError: errors.email?.message,
    emailPlaceholder: t('auth.otp.emailPlaceholder'),
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
    isPending,
  };
};
