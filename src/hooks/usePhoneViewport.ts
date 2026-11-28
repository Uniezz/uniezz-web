import { useSyncExternalStore } from 'react';

// below Tailwind's `lg`: the screens that mirror the mobile app
const PHONE_QUERY = '(max-width: 1023.98px)';
const subscribe = (callback: () => void): (() => void) => {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getSnapshot = (): boolean => window.matchMedia(PHONE_QUERY).matches;

export function usePhoneViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
