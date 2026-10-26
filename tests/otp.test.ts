import { expect, mock, test } from 'bun:test';

let result: {
  data?: { token: string; expiresAt: string };
  response: { ok: boolean; status: number };
};
let sent: { path: string; body: unknown };

mock.module('../src/api/client.ts', () => ({
  api: {
    POST: async (path: string, { body }: { body: unknown }) => {
      sent = { path, body };
      return result;
    },
  },
}));

const { requestOtpCode, verifyOtpCode } = await import('../src/api/otp.ts');

test('requests an OTP with the selected university and accepts an empty 204 response', async () => {
  result = { response: { ok: true, status: 204 } };
  await requestOtpCode({ email: 'student@kul.pl', university: 'kul' });
  expect(sent).toEqual({
    path: '/auth/otp/request',
    body: { email: 'student@kul.pl', university: 'kul' },
  });
});

test('returns the verified session and reports invalid codes', async () => {
  result = {
    data: { token: 'token', expiresAt: '2026-10-26T00:00:00Z' },
    response: { ok: true, status: 200 },
  };
  const body = { code: '123456', email: 'student@kul.pl', university: 'kul' };
  expect(await verifyOtpCode(body)).toEqual(result.data);
  expect(sent).toEqual({ path: '/auth/otp/verify', body });

  result = { response: { ok: false, status: 401 } };
  expect(verifyOtpCode(body)).rejects.toThrow('Wrong or expired code');
});
