import posthog from 'posthog-js';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMyAvatar, deleteMyBanner, getProfiles, getPublicProfile, signOut } from '@/api';
import type { components } from '@/@types/schema';
import i18n from '@/i18n';
import { profileSearchQuery } from '@/utils';

export function useProfileSearch(name: string) {
  const q = profileSearchQuery(name);
  return useInfiniteQuery({
    queryKey: ['profiles', 'search', q],
    queryFn: ({ pageParam }) => getProfiles(q, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function usePublicProfile(id: string) {
  return useQuery({ queryKey: ['profiles', id], queryFn: () => getPublicProfile(id) });
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
