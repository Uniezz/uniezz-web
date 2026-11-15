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

// An https link opens the app where it's installed (associated domains, verified app links) and this site elsewhere.
export function inviteUrl(code: string): string {
  return `https://uniezz.pl/invite/${encodeURIComponent(code)}`;
}

const INVITE_REDEEM_DAYS = 7;

/** The API accepts an invite code only during an account's first 7 days. */
export function canRedeemInvite(createdAt: string, now = Date.now()): boolean {
  return now - Date.parse(createdAt) < INVITE_REDEEM_DAYS * 24 * 60 * 60_000;
}
