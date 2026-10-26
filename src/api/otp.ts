import type { OtpRequestInputBody, OtpVerifyInputBody } from '@/@types/auth';
import { OTP_REQUEST_ERRORS, OTP_VERIFY_ERRORS } from '@/utils/otp';
import { api } from './client';

export async function requestOtpCode(body: OtpRequestInputBody) {
  const fallback = 'Couldn’t send the code. Try again.';
  const { response } = await api.POST('/auth/otp/request', { body }).catch(() => {
    throw new Error(fallback);
  });

  if (!response.ok) throw new Error(OTP_REQUEST_ERRORS[response.status] ?? fallback);
}

export async function verifyOtpCode(body: OtpVerifyInputBody) {
  const fallback = 'Couldn’t verify the code. Try again.';
  const { data, response } = await api.POST('/auth/otp/verify', { body }).catch(() => {
    throw new Error(fallback);
  });

  if (!response.ok || !data) throw new Error(OTP_VERIFY_ERRORS[response.status] ?? fallback);
  return data;
}
