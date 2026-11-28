import posthog from 'posthog-js';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteMyAvatar,
  deleteMyBanner,
  followProfile,
  getMyFollowers,
  getMyFollowing,
  getProfileFollowers,
  getProfileFollowing,
  getProfiles,
  getPublicProfile,
  signOut,
  unfollowProfile,
} from '@/api';
import type { PublicProfile } from '@/@types';
import type { components } from '@/@types/schema';
import i18n from '@/i18n';
import { profileSearchQuery, retryUnlessNotFound } from '@/utils';

export function useProfileSearch(name: string) {
  const q = profileSearchQuery(name);
  return useInfiniteQuery({
    queryKey: ['profiles', 'search', q],
    queryFn: ({ pageParam }) => getProfiles(q, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function usePublicProfile(id: string, isEnabled = true) {
  return useQuery({
    queryKey: ['profiles', id],
    queryFn: () => getPublicProfile(id),
    retry: retryUnlessNotFound,
    enabled: isEnabled,
  });
}

// The count moves at once; a failed request puts the profile back.
export function useFollowProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'profile_follow' },
    mutationKey: ['profileFollow'],
    // repeated taps run in order, as the mobile app's optimistic toggles
    scope: { id: 'profileFollow' },
    mutationFn: ({ id, follow }: { id: string; follow: boolean }) =>
      follow ? followProfile(id) : unfollowProfile(id),
    onMutate: async ({ id, follow }) => {
      await queryClient.cancelQueries({ queryKey: ['profiles', id] });
      const previous = queryClient.getQueryData<PublicProfile>(['profiles', id]);
      queryClient.setQueryData<PublicProfile>(['profiles', id], (profile) =>
        profile && profile.followedByMe !== follow
          ? {
              ...profile,
              followedByMe: follow,
              followersCount: profile.followersCount + (follow ? 1 : -1),
            }
          : profile,
      );
      return { previous };
    },
    onError: (_error, { id }, context) => {
      queryClient.setQueryData(['profiles', id], context?.previous);
    },
    onSettled: (_data, _error, { id }) => {
      // only the last queued tap refetches, so a refetch never flips the button back
      if (queryClient.isMutating({ mutationKey: ['profileFollow'] }) > 1) return;
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['profiles', id] }),
        queryClient.invalidateQueries({ queryKey: ['profile', 'me'] }),
        queryClient.invalidateQueries({ queryKey: ['follows'] }),
      ]);
    },
  });
}

/** Followers of a student, or of the signed-in student when profileId is missing. */
export function useFollowers(profileId?: string) {
  return useInfiniteQuery({
    queryKey: ['follows', profileId ?? 'me', 'followers'],
    queryFn: ({ pageParam }) =>
      profileId ? getProfileFollowers(profileId, pageParam) : getMyFollowers(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

/** Students a student follows, or the signed-in student follows when profileId is missing. */
export function useFollowing(profileId?: string) {
  return useInfiniteQuery({
    queryKey: ['follows', profileId ?? 'me', 'following'],
    queryFn: ({ pageParam }) =>
      profileId ? getProfileFollowing(profileId, pageParam) : getMyFollowing(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'avatar_delete', progress: () => i18n.t('progress.avatarDelete') },
    mutationFn: deleteMyAvatar,
    onSuccess: () => {
      queryClient.setQueryData<components['schemas']['Profile']>(['profile', 'me'], (profile) =>
        profile ? { ...profile, avatarUrl: null } : profile,
      );
      void queryClient.invalidateQueries({ queryKey: ['profile', 'photos'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'banner_delete', progress: () => i18n.t('progress.bannerDelete') },
    mutationFn: deleteMyBanner,
    onSuccess: () => {
      queryClient.setQueryData<components['schemas']['Profile']>(['profile', 'me'], (profile) =>
        profile ? { ...profile, bannerUrl: null } : profile,
      );
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'sign_out', progress: () => i18n.t('progress.signOut') },
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
      try {
        posthog.reset();
      } catch {
        // Analytics must not prevent signing out.
      }
      window.location.replace('/login');
    },
  });
}
