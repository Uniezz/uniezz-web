import type { QueryClient } from '@tanstack/react-query';
import { createElement } from 'react';
import baseToast from 'react-hot-toast';
// Direct path: the components barrel pulls in the API client and its env check.
import { UICoin } from '@/ui/components/UICoin';
import i18n from '@/i18n';

/** Coins a mutation response says it paid; 0 when it has no `coinsEarned`. */
export function coinsEarned(data: unknown): number {
  if (!data || typeof data !== 'object' || !('coinsEarned' in data)) return 0;
  return typeof data.coinsEarned === 'number' && data.coinsEarned > 0 ? data.coinsEarned : 0;
}

const SOUND_URL = '/app/sounds/coin-pickup.mp3';
let sound: HTMLAudioElement | undefined;
let lastPlayed = 0;

function playCoinSound() {
  // Nested mutations report the same reward twice in a row; play it once.
  const now = Date.now();
  if (now - lastPlayed < 500) return;
  lastPlayed = now;
  try {
    sound ??= new Audio(SOUND_URL);
    sound.currentTime = 0;
    // Autoplay rules or a missing file must never break the action that paid the coins.
    void sound.play().catch(() => undefined);
  } catch {
    // Audio is unavailable (tests, old browsers).
  }
}

/**
 * Shows a toast and plays a sound whenever a mutation pays Uniezz coins. Every response that can
 * pay coins carries `coinsEarned`, so it also marks the quests, history and balance as changed.
 */
export function showCoinRewards(queryClient: QueryClient) {
  return queryClient.getMutationCache().subscribe((event) => {
    if (event.type !== 'updated' || event.action.type !== 'success') return;
    const { data } = event.action;
    if (!data || typeof data !== 'object' || !('coinsEarned' in data)) return;
    // Likes, replies and posts move quest progress even when they pay nothing.
    void queryClient.invalidateQueries({ queryKey: ['rewards'] });
    const count = coinsEarned(data);
    if (count > 0) void queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    // One fixed id: nested mutations (publish wraps create) report the same coins twice.
    // shortcut: two different rewards at the same moment show only the last; sum them if that happens.
    if (count > 0) {
      baseToast(i18n.t('rewards.coinsEarned', { amount: count }), {
        id: 'coin-reward',
        icon: createElement(UICoin, { className: 'size-5' }),
      });
      playCoinSound();
    }
  });
}
