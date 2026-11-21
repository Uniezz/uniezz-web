import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdateMeBody } from '@/@types';
import {
  addMyProfilePhoto,
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

export function useMyProfilePhotos() {
  return useQuery({ queryKey: ['profile', 'photos'], queryFn: listMyProfilePhotos });
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
