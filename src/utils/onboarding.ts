// shortcut: the API has no "new account" flag, so a profile created in the last 10 minutes
// counts as a first sign-in; switch when /auth/exchange or /auth/otp/verify returns one.
// TEMP preview: shows onboarding to every account on every sign-in. Set to false before committing.
const PREVIEW_ONBOARDING = true;

export function isNewProfile(createdAt: string, now = Date.now()) {
  if (PREVIEW_ONBOARDING) return true;
  return now - Date.parse(createdAt) < 10 * 60_000;
}

const doneKey = (userId: string) => `uniezz:onboarding-done:${userId}`;

// shortcut: kept in this browser only; a backend flag would close onboarding on every device.
export function isOnboardingDone(userId: string): boolean {
  if (PREVIEW_ONBOARDING) return false;
  try {
    return localStorage.getItem(doneKey(userId)) === '1';
  } catch {
    return false;
  }
}

export function markOnboardingDone(userId: string): void {
  try {
    localStorage.setItem(doneKey(userId), '1');
  } catch {
    // Without storage, the 10-minute new-profile window still ends onboarding.
  }
}
