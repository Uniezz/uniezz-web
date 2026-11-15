import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { getMyCoinGrants, getMyDailyQuests, getMyInviteCode, redeemInvite } from '@/api';

// Mutations that return `coinsEarned` refresh both through the coin reward subscriber.
export function useMyDailyQuests() {
  return useQuery({ queryKey: ['rewards', 'quests'], queryFn: getMyDailyQuests });
}

export function useMyInviteCode() {
  return useQuery({ queryKey: ['rewards', 'inviteCode'], queryFn: getMyInviteCode });
}

// The coin reward subscriber shows the +50 toast and refreshes balance and history.
export function useRedeemInvite() {
  return useMutation({
    meta: { analyticsAction: 'invite_redeem' },
    mutationKey: ['rewards', 'redeemInvite'],
    mutationFn: redeemInvite,
  });
}

export function useMyCoinGrants() {
  return useInfiniteQuery({
    queryKey: ['rewards', 'grants'],
    queryFn: ({ pageParam }) => getMyCoinGrants(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}
