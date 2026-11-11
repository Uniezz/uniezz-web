import type { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * Patches one item in every cached query under `queryKey` (single items and infinite pages),
 * so an edit, like or rating shows at once without refetching every loaded page.
 */
export function patchCachedItem(
  queryClient: QueryClient,
  queryKey: QueryKey,
  id: string,
  patch: object,
): void {
  const update = (item: unknown) =>
    item && typeof item === 'object' && 'id' in item && item.id === id
      ? { ...item, ...patch }
      : item;
  queryClient.setQueriesData({ queryKey }, (data: unknown) => {
    if (!data || typeof data !== 'object' || !('pages' in data) || !Array.isArray(data.pages)) {
      return update(data);
    }
    return {
      ...data,
      pages: data.pages.map((page: { items?: unknown[] | null }) => ({
        ...page,
        items: page.items?.map(update) ?? page.items,
      })),
    };
  });
}
