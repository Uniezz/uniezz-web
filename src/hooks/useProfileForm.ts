import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { components } from '@/@types/schema';
import { updateMyProfile } from '@/api';
import { profileFormSchema, type ProfileFormSchema } from '@/schemas';
import { useUploadImage } from './useUploadImage';

function defaults(profile: components['schemas']['Profile']): ProfileFormSchema {
  return {
    first: profile.firstName ?? '',
    last: profile.lastName ?? '',
    bio: profile.bio ?? '',
    interests: profile.interests?.join(', ') ?? '',
    privacy: profile.privacy,
    photo: profile.avatarUrl ?? '/app/avatar.png',
  };
}

export function useProfileForm(profile: components['schemas']['Profile']) {
  const queryClient = useQueryClient();
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaults(profile),
  });
  const { reset } = form;
  const {
    data: uploadedImage,
    mutateAsync: uploadAvatar,
    reset: resetUpload,
    isPending: isUploading,
  } = useUploadImage('avatar');
  const {
    mutateAsync: saveProfile,
    isSuccess,
    isPending: isSaving,
  } = useMutation({
    mutationKey: ['profile', 'update'],
    mutationFn: async (values: ProfileFormSchema) => {
      const uploaded = values.avatarFile
        ? uploadedImage?.file === values.avatarFile
          ? uploadedImage
          : await uploadAvatar(values.avatarFile)
        : undefined;
      return updateMyProfile({
        firstName: values.first,
        lastName: values.last,
        bio: values.bio.trim(),
        interests: values.interests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        privacy: values.privacy,
        avatarMediaId: uploaded?.mediaId,
      });
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(['profile', 'me'], saved);
      reset(defaults(saved));
      resetUpload();
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
  return { form, saveProfile, isSuccess, isPending: isSaving || isUploading };
}
