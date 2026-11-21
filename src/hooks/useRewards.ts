import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveChallenge,
  createChallenge,
  getChallenges,
  getMyChallenges,
  updateChallenge,
  getMyCoinGrants,
  getMyDailyQuests,
  getMyInviteCode,
  redeemInvite,
} from '@/api';
import i18n from '@/i18n';

// Mutations that return `coinsEarned` refresh both through the coin reward subscriber.
export function useMyDailyQuests() {
  return useQuery({ queryKey: ['rewards', 'quests'], queryFn: getMyDailyQuests });
}

export function useMyChallenges() {
  return useQuery({ queryKey: ['rewards', 'challenges'], queryFn: getMyChallenges });
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

export function useChallenges() {
  return useInfiniteQuery({
    queryKey: ['rewards', 'admin', 'challenges'],
    queryFn: ({ pageParam }) => getChallenges(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    // Tab switches remount the list; mutations invalidate it, so 5 minutes is fresh enough.
    staleTime: 5 * 60_000,
  });
}

// A new challenge is visible to students right away when it has already started.
export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'challenge_create', progress: () => i18n.t('progress.challengeSave') },
    mutationFn: createChallenge,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rewards', 'admin', 'challenges'] });
      void queryClient.invalidateQueries({ queryKey: ['rewards', 'challenges'] });
    },
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'challenge_update', progress: () => i18n.t('progress.challengeSave') },
    mutationFn: updateChallenge,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rewards', 'admin', 'challenges'] });
      void queryClient.invalidateQueries({ queryKey: ['rewards', 'challenges'] });
    },
  });
}

// Archived challenges stop counting for students; coins already paid stay.
export function useArchiveChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      analyticsAction: 'challenge_archive',
      progress: () => i18n.t('progress.challengeArchive'),
    },
    mutationFn: archiveChallenge,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rewards', 'admin', 'challenges'] });
      void queryClient.invalidateQueries({ queryKey: ['rewards', 'challenges'] });
    },
  });
}
