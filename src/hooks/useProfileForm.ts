import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { components } from '@/@types/schema';
import { updateMyProfile } from '@/api';
import { profileFormSchema, type ProfileFormSchema, type ProfileSubmission } from '@/schemas';
import { useUploadImage } from './useUploadImage';

function defaults(profile: components['schemas']['Profile']): ProfileFormSchema {
  return {
    first: profile.firstName ?? '',
    last: profile.lastName ?? '',
    bio: profile.bio ?? '',
    interests: profile.interests?.join(', ') ?? '',
    privacy: profile.privacy,
    photo: profile.avatarUrl ?? '/app/avatar.png',
    avatarFile: undefined,
    banner: profile.bannerUrl ?? '',
    bannerFile: undefined,
    song: profile.songUrl ?? '',
  };
}

export function useProfileForm(profile: components['schemas']['Profile']) {
  const queryClient = useQueryClient();
  const form = useForm<ProfileFormSchema, unknown, ProfileSubmission>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaults(profile),
  });
  const { reset } = form;
  const {
    data: uploadedAvatar,
    mutateAsync: uploadAvatar,
    reset: resetAvatarUpload,
    isPending: isUploadingAvatar,
  } = useUploadImage('avatar');
  const {
    data: uploadedBanner,
    mutateAsync: uploadBanner,
    reset: resetBannerUpload,
    isPending: isUploadingBanner,
  } = useUploadImage('banner');
  const { mutateAsync: saveProfile, isPending: isSaving } = useMutation({
    meta: { analyticsAction: 'profile_update' },
    mutationKey: ['profile', 'update'],
    mutationFn: async (values: ProfileSubmission) => {
      const avatar = values.avatarFile
        ? uploadedAvatar?.file === values.avatarFile
          ? uploadedAvatar
          : await uploadAvatar(values.avatarFile)
        : undefined;
      const banner = values.bannerFile
        ? uploadedBanner?.file === values.bannerFile
          ? uploadedBanner
          : await uploadBanner(values.bannerFile)
        : undefined;
      return updateMyProfile({
        firstName: values.first,
        lastName: values.last,
        bio: values.bio,
        interests: values.interests,
        privacy: values.privacy,
        avatarMediaId: avatar?.mediaId,
        bannerMediaId: banner?.mediaId,
        songUrl: values.song,
      });
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(['profile', 'me'], saved);
      reset(defaults(saved));
      resetAvatarUpload();
      resetBannerUpload();
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
  return { form, saveProfile, isPending: isSaving || isUploadingAvatar || isUploadingBanner };
}
