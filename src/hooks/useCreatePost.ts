import { useMutation } from '@tanstack/react-query';
import type { PostSchema } from '@/schemas';
import { postSubmission } from '@/utils/feed';
import { useMyProfile } from './useMyProfile';
import { useUploadPostImages } from './useUploadPostImages';
import { useCreateFeedPost } from './useCreateFeedPost';

export function useCreatePost() {
  const { data: profile } = useMyProfile();
  const { uploadImages } = useUploadPostImages();
  const { variables: previousRequest, mutateAsync: createPost } = useCreateFeedPost();

  return useMutation({
    mutationKey: ['feed', 'create'],
    mutationFn: async (values: PostSchema) => {
      if (!profile) throw new Error('Profile unavailable');
      const mediaIds = await uploadImages(values.images);
      const body = {
        type: values.type,
        title: values.title,
        content: values.body,
        university: values.audience === 'all' ? 'all' : profile.universityId,
        eventDate:
          values.type === 'event'
            ? new Date(`${values.date}T${values.time}`).toISOString()
            : undefined,
        mediaIds: mediaIds.length ? mediaIds : undefined,
        tags: values.tags,
      };
      return createPost(postSubmission(body, previousRequest));
    },
  });
}
