const INVITE_CODE_KEY = 'uniezz:invite-code';
const INVITE_CODE_PATTERN = /^[A-Z0-9]{7}$/;

export function saveInviteCode(value: string): void {
  const code = value.trim().toUpperCase();
  if (!INVITE_CODE_PATTERN.test(code)) return;

  try {
    sessionStorage.setItem(INVITE_CODE_KEY, code);
  } catch {
    // Login can continue without referral attribution when browser storage is unavailable.
  }
}

export function getInviteCode(): string | undefined {
  try {
    const code = sessionStorage.getItem(INVITE_CODE_KEY);
    if (!code || !INVITE_CODE_PATTERN.test(code)) return undefined;
    return code;
  } catch {
    return undefined;
  }
}

export function clearInviteCode(): void {
  try {
    sessionStorage.removeItem(INVITE_CODE_KEY);
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
}
