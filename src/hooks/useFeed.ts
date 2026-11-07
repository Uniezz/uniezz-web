import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import {
  createFeedComment,
  deleteFeedComment,
  deleteFeedPost,
  getCommentReplies,
  getFeedComments,
  getFeedPost,
  getFeedPosts,
  setFeedLike,
  updateFeedComment,
  updateFeedPost,
} from '@/api';
import type { FeedFilters } from '@/@types';

// Patches one post or comment in every cached feed query (single items and infinite pages), so a
// like or edit doesn't refetch every loaded page.
function patchFeedItem(queryClient: QueryClient, id: string, patch: Record<string, unknown>): void {
  const update = (item: unknown) =>
    item && typeof item === 'object' && 'id' in item && item.id === id
      ? { ...item, ...patch }
      : item;
  queryClient.setQueriesData({ queryKey: ['feed'] }, (data: unknown) => {
    if (!data || typeof data !== 'object' || !('pages' in data) || !Array.isArray(data.pages)) {
      return update(data);
    }
    return {
      ...data,
      pages: data.pages.map((page: { items?: unknown[] | null }) => ({
        ...page,
        items: page.items?.map(update) ?? page.items,
      })),
    };
  });
}

export function useUpdateFeedComment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'comment_update' },
    mutationFn: updateFeedComment,
    onSuccess: (comment) => patchFeedItem(queryClient, comment.id, comment),
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
      void queryClient.invalidateQueries({ queryKey: ['feed', 'posts'] });
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
    onSuccess: ({ liked, likesCount }, { id }) =>
      patchFeedItem(queryClient, id, { likedByMe: liked, likesCount }),
  });
}

export function useFeedPosts(filters: FeedFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['feed', 'posts', filters],
    queryFn: ({ pageParam }) => getFeedPosts(filters, pageParam),
    // Keeps the current posts on screen while a filter change loads, instead of a skeleton flash.
    placeholderData: keepPreviousData,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
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
