import { useMutation } from '@tanstack/react-query';
import type { PostSchema } from '@/schemas';
import { postSubmission } from '@/utils/feed';
import { useMyProfile } from './useMyProfile';
import { useUploadImage } from './useUploadImage';
import { useCreateFeedPost } from './useCreateFeedPost';

export function useCreatePost() {
  const { data: profile } = useMyProfile();
  const { data: uploaded, mutateAsync: uploadImage, reset: resetUpload } = useUploadImage('feed');
  const { variables: previousRequest, mutateAsync: createPost } = useCreateFeedPost();

  return useMutation({
    mutationKey: ['feed', 'create'],
    mutationFn: async (values: PostSchema) => {
      if (!profile) throw new Error('Profile unavailable');
      if (!values.image) resetUpload();
      const media = values.image
        ? uploaded?.file === values.image
          ? uploaded
          : await uploadImage(values.image)
        : undefined;
      const body = {
        type: values.type,
        title: values.title,
        content: values.body,
        university: values.audience === 'all' ? 'all' : profile.universityId,
        eventDate:
          values.type === 'event'
            ? new Date(`${values.date}T${values.time}`).toISOString()
            : undefined,
        mediaIds: media ? [media.mediaId] : undefined,
      };
      return createPost(postSubmission(body, previousRequest));
    },
  });
}
