import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createFeedComment,
  deleteFeedComment,
  deleteFeedPost,
  getCommentReplies,
  getFeedComments,
  getFeedPost,
  getFeedPosts,
  getFeaturedFeedPosts,
  getFeedPostNavigation,
  getLikedFeedPosts,
  getSavedFeedPosts,
  setFeedLike,
  setFeedSave,
  updateFeedComment,
  updateFeedPost,
} from '@/api';
import type { FeedFilters } from '@/@types';
import { patchCachedItem } from '@/utils/query';

export function useUpdateFeedComment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'comment_update' },
    mutationFn: updateFeedComment,
    onSuccess: (comment) => patchCachedItem(queryClient, ['feed'], comment.id, comment),
  });
}

export function useUpdateFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'post_update' },
    mutationFn: updateFeedPost,
    onSuccess: (post) => {
      queryClient.setQueryData(['feed', 'post', post.id], post);
      return queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeleteFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'post_delete' },
    mutationFn: deleteFeedPost,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['feed', 'post', id], exact: true });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeleteFeedComment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'comment_delete' },
    mutationFn: deleteFeedComment,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['feed', 'comments'] }),
        queryClient.invalidateQueries({ queryKey: ['feed', 'replies'] }),
        queryClient.invalidateQueries({ queryKey: ['feed', 'post'] }),
      ]),
  });
}

export function useFeedLike() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'post_like_set' },
    mutationFn: setFeedLike,
    onSuccess: ({ liked, likesCount }, { id, kind }) => {
      patchCachedItem(queryClient, ['feed'], id, { likedByMe: liked, likesCount });
      if (kind === 'post') {
        void queryClient.invalidateQueries({ queryKey: ['feed', 'featured'] });
        // Liking changes membership in the caller's liked list, so drop the cached pages.
        void queryClient.invalidateQueries({ queryKey: ['feed', 'liked'] });
      }
    },
  });
}

export function useFeedSave() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'post_save_set' },
    mutationFn: setFeedSave,
    // Saved flips instantly; onError rolls back to the snapshot taken here.
    onMutate: async ({ id, saved }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previous = queryClient.getQueriesData({ queryKey: ['feed'] });
      patchCachedItem(queryClient, ['feed'], id, { savedByMe: saved });
      return { previous };
    },
    onError: (_, __, context) => {
      for (const [key, value] of context?.previous ?? []) {
        queryClient.setQueryData(key, value);
      }
    },
    onSuccess: ({ saved }, { id }) => {
      patchCachedItem(queryClient, ['feed'], id, { savedByMe: saved });
      // Saving changes membership in the caller's saved list, so drop the cached pages.
      void queryClient.invalidateQueries({ queryKey: ['feed', 'saved'] });
    },
  });
}

/** Which list of posts to show: the feed query, or the caller's liked or saved posts. */
export type FeedPostSource = 'posts' | 'liked' | 'saved';

export function useFeedPosts(filters: FeedFilters = {}, source: FeedPostSource = 'posts') {
  return useInfiniteQuery({
    queryKey: ['feed', source, filters],
    queryFn: ({ pageParam }) =>
      source === 'liked'
        ? getLikedFeedPosts(pageParam)
        : source === 'saved'
          ? getSavedFeedPosts(pageParam)
          : getFeedPosts(filters, pageParam),
    // Keeps the current posts on screen while a filter change loads, instead of a skeleton flash.
    placeholderData: keepPreviousData,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useFeaturedFeedPosts() {
  return useQuery({ queryKey: ['feed', 'featured'], queryFn: getFeaturedFeedPosts });
}

export function useFeedPostNavigation(id: string) {
  return useQuery({
    queryKey: ['feed', 'navigation', id],
    queryFn: () => getFeedPostNavigation(id),
  });
}

export function useFeedPost(id: string) {
  return useQuery({ queryKey: ['feed', 'post', id], queryFn: () => getFeedPost(id) });
}

export function useFeedComments(id: string) {
  return useInfiniteQuery({
    queryKey: ['feed', 'comments', id],
    queryFn: ({ pageParam }) => getFeedComments(id, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useCommentReplies(id: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ['feed', 'replies', id],
    queryFn: ({ pageParam }) => getCommentReplies(id, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { mutateAsync, variables, isError, isPending } = useMutation({
    meta: { analyticsAction: 'comment_create' },
    mutationKey: ['feed', 'create-comment'],
    mutationFn: createFeedComment,
    onSuccess: (_, { id, replyToCommentId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['feed', 'comments', id] }),
        queryClient.invalidateQueries({ queryKey: ['feed', 'post', id] }),
        replyToCommentId &&
          queryClient.invalidateQueries({ queryKey: ['feed', 'replies', replyToCommentId] }),
      ]),
  });

  function createComment(input: Omit<Parameters<typeof createFeedComment>[0], 'key'>) {
    const key =
      isError &&
      variables?.id === input.id &&
      variables.content === input.content &&
      variables.replyToCommentId === input.replyToCommentId
        ? variables.key
        : crypto.randomUUID();
    return mutateAsync({ ...input, key });
  }

  return { createComment, isPending };
}
