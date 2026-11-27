import { useEffect, useEffectEvent } from 'react';
import { isNotFoundError, toast } from '@/utils';

/** A shared link to something deleted or hidden: say so in a toast and leave for a list. */
export function useLeaveWhenGone(error: unknown, message: string, leave: () => void): void {
  const isGone = isNotFoundError(error);
  const onGone = useEffectEvent(() => {
    // One id, so a re-run (Strict Mode) doesn't stack a second toast.
    toast.error(message, { id: 'not-found' });
    leave();
  });
  useEffect(() => {
    if (isGone) onGone();
  }, [isGone]);
}
