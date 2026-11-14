import type { MutationCache } from '@tanstack/react-query';
import baseToast from 'react-hot-toast';

const PROGRESS_ID = 'mutation-progress';
// Grace period so the form's success/error toast can take over the progress toast.
const HANDOFF_MS = 300;
const running = new Set<number>();
let progressVisible = false;
let dismissTimer: ReturnType<typeof setTimeout> | undefined;

type ToastOptions = Parameters<typeof baseToast.success>[1];
/** Reuses the progress toast, so one form submit shows one toast from loading to result. */
function takeOver(options: ToastOptions): ToastOptions {
  if (!progressVisible || running.size > 0) return options;
  clearTimeout(dismissTimer);
  progressVisible = false;
  return { ...options, id: PROGRESS_ID };
}

export const toast = Object.assign(
  (...args: Parameters<typeof baseToast>) => baseToast(...args),
  baseToast,
  {
    success: (message: Parameters<typeof baseToast.success>[0], options?: ToastOptions) =>
      baseToast.success(message, takeOver(options)),
    error: (message: Parameters<typeof baseToast.error>[0], options?: ToastOptions) =>
      baseToast.error(message, takeOver(options)),
  },
);

/** Shows a loading toast while any mutation with `meta.progress` is running. */
export function showMutationProgress(cache: MutationCache) {
  return cache.subscribe((event) => {
    if (event.type !== 'updated') return;
    const { mutation, action } = event;
    const progress = mutation.meta?.progress;
    if (!progress) return;
    if (action.type === 'pending') {
      running.add(mutation.mutationId);
      clearTimeout(dismissTimer);
      progressVisible = true;
      baseToast.loading(progress(), { id: PROGRESS_ID });
    } else if (action.type === 'success' || action.type === 'error') {
      running.delete(mutation.mutationId);
      if (running.size > 0 || !progressVisible) return;
      clearTimeout(dismissTimer);
      dismissTimer = setTimeout(() => {
        progressVisible = false;
        baseToast.dismiss(PROGRESS_ID);
      }, HANDOFF_MS);
    }
  });
}
