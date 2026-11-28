import { useRouter, type NavigateOptions } from '@tanstack/react-router';

/**
 * The mobile app's Back: returns to the previous screen of this app. A screen opened straight from a
 * link has none, so it is replaced by `fallback` instead; Back never adds an entry, so it can't loop
 * or leave the site.
 */
export function useGoBack() {
  const router = useRouter();
  return (fallback: NavigateOptions, ignoreBlocker = false) => {
    if (router.history.canGoBack()) return router.history.back({ ignoreBlocker });
    void router.navigate({ ...fallback, replace: true, ignoreBlocker });
  };
}
