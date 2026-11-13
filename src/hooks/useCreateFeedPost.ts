import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedPost } from '@/api';
import type { postSubmission } from '@/utils';

export function useCreateFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'post_create' },
    mutationKey: ['feed', 'create-post'],
    mutationFn: ({ body, key }: ReturnType<typeof postSubmission>) => createFeedPost(body, key),
    onSuccess: (post) => {
      queryClient.setQueryData(['feed', 'post', post.id], post);
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
