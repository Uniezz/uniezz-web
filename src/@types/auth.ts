import type { paths } from './schema';

export type OtpRequestInputBody = NonNullable<
  paths['/auth/otp/request']['post']['requestBody']['content']['application/json']
>;

export type OtpVerifyInputBody = NonNullable<
  paths['/auth/otp/verify']['post']['requestBody']['content']['application/json']
>;
