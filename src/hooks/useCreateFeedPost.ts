import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedPost } from '@/api';
import type { postSubmission } from '@/utils';
import i18n from '@/i18n';

export function useCreateFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'post_create', progress: () => i18n.t('progress.postCreate') },
    mutationKey: ['feed', 'create-post'],
    mutationFn: ({ body, key }: ReturnType<typeof postSubmission>) => createFeedPost(body, key),
    onSuccess: (post) => {
      queryClient.setQueryData(['feed', 'post', post.id], post);
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
