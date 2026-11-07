import posthog from 'posthog-js';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMyAvatar, getProfiles, getPublicProfile, signOut } from '@/api';
import type { components } from '@/@types/schema';

export function useProfileSearch(name: string) {
  return useInfiniteQuery({
    queryKey: ['profiles', 'search', name],
    queryFn: ({ pageParam }) => getProfiles(name, pageParam),
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
    meta: { analyticsAction: 'avatar_delete' },
    mutationFn: deleteMyAvatar,
    onSuccess: () => {
      queryClient.setQueryData<components['schemas']['Profile']>(['profile', 'me'], (profile) =>
        profile ? { ...profile, avatarUrl: null } : profile,
      );
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'sign_out' },
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
      try {
        posthog.reset();
      } catch {
        // Analytics must not prevent signing out.
      }
      window.location.assign('/login');
    },
  });
}
