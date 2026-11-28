import { useSyncExternalStore } from 'react';

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
};

/** Whether the page has scrolled more than `offset` px, as the mobile app's collapsing headers. */
export function useScrolledPast(offset: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > offset,
    () => false,
  );
}
