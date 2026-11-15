// shortcut: the API has no "new account" flag, so a profile created in the last 10 minutes
// counts as a first sign-in; switch when /auth/exchange or /auth/otp/verify returns one.
export function isNewProfile(createdAt: string, now = Date.now()) {
  return now - Date.parse(createdAt) < 10 * 60_000;
}

const doneKey = (userId: string) => `uniezz:onboarding-done:${userId}`;

// shortcut: kept in this browser only; a backend flag would close onboarding on every device.
export function isOnboardingDone(userId: string): boolean {
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
