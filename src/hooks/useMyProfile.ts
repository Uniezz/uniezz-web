import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdateMeBody } from '@/@types';
import {
  addMyProfilePhoto,
  completeMyOnboarding,
  deleteMyProfile,
  deleteMyProfilePhoto,
  getMyProfile,
  listMyProfilePhotos,
  reorderMyProfilePhotos,
  updateMyProfile,
} from '@/api';
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
    mutationFn: (body: UpdateMeBody) => updateMyProfile(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      // The photo list starts with the avatar.
      void queryClient.invalidateQueries({ queryKey: ['profile', 'photos'] });
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'onboarding_complete' },
    mutationFn: completeMyOnboarding,
    onSuccess: () => {
      // Set it right away so the /onboarding guard redirects without waiting for a refetch.
      queryClient.setQueryData(
        myProfileQueryOptions().queryKey,
        (profile) =>
          profile && { ...profile, onboardedAt: profile.onboardedAt ?? new Date().toISOString() },
      );
      void queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      // Onboarded students now appear in the student list.
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
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
      window.location.replace('/login');
    },
  });
}

export function useMyProfilePhotos(enabled = true) {
  return useQuery({ queryKey: ['profile', 'photos'], queryFn: listMyProfilePhotos, enabled });
}

// The public profile shows these photos too, so changes also refresh ['profiles'].
export function useAddProfilePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'profile_photo_add', progress: () => i18n.t('progress.photoAdd') },
    mutationFn: addMyProfilePhoto,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', 'photos'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useDeleteProfilePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      analyticsAction: 'profile_photo_delete',
      progress: () => i18n.t('progress.photoDelete'),
    },
    mutationFn: deleteMyProfilePhoto,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', 'photos'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useReorderProfilePhotos() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      analyticsAction: 'profile_photo_reorder',
      progress: () => i18n.t('progress.photoReorder'),
    },
    mutationFn: reorderMyProfilePhotos,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', 'photos'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}
