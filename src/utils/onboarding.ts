// shortcut: the API has no "new account" flag, so a profile created in the last 10 minutes
// counts as a first sign-in; switch when /auth/exchange or /auth/otp/verify returns one.
export function isNewProfile(createdAt: string, now = Date.now()) {
  return now - Date.parse(createdAt) < 10 * 60_000;
}
