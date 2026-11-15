import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getMyCoinGrants, getMyDailyQuests } from '@/api';

// Mutations that return `coinsEarned` refresh both through the coin reward subscriber.
export function useMyDailyQuests() {
  return useQuery({ queryKey: ['rewards', 'quests'], queryFn: getMyDailyQuests });
}

export function useMyCoinGrants() {
  return useInfiniteQuery({
    queryKey: ['rewards', 'grants'],
    queryFn: ({ pageParam }) => getMyCoinGrants(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}
