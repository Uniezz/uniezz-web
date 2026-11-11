import { useInfiniteQuery } from '@tanstack/react-query';
import { getFaqEntries } from '@/api';

export function useFaqEntries() {
  return useInfiniteQuery({
    queryKey: ['faq'],
    queryFn: ({ pageParam }) => getFaqEntries(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}
