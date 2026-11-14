import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { components } from '@/@types/schema';
import { deleteMyProfile, getMyProfile, updateMyProfile } from '@/api';
import i18n from '@/i18n';

export function myProfileQueryOptions() {
  return queryOptions({ queryKey: ['profile', 'me'], queryFn: getMyProfile });
}

export function useMyProfile() {
  return useQuery(myProfileQueryOptions());
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'profile_update', progress: () => i18n.t('progress.profileUpdate') },
    mutationFn: (body: components['schemas']['UpdateMeInputBody']) => updateMyProfile(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}

export function useDeleteMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'profile_delete', progress: () => i18n.t('progress.profileDelete') },
    mutationFn: deleteMyProfile,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
