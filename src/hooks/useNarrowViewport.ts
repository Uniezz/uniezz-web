import { useSyncExternalStore } from 'react';
const subscribe = (callback: () => void): (() => void) => {
  const query = window.matchMedia('(max-width: 767px)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getSnapshot = (): boolean => window.matchMedia('(max-width: 767px)').matches;
export function useNarrowViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
