import { onlineManager } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

const getSnapshot = (): boolean => onlineManager.isOnline();

/** The same online state that pauses queries and mutations. */
export function useOnline(): boolean {
  return useSyncExternalStore(onlineManager.subscribe, getSnapshot, () => true);
}
