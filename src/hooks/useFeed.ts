import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useUpdateFeedComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFeedComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });
}

export function useUpdateFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
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
    mutationFn: deleteFeedComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });
}

export function useFeedLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setFeedLike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });
}

export function useFeedPosts(filters: FeedFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['feed', 'posts', filters],
    queryFn: ({ pageParam }) => getFeedPosts(filters, pageParam),
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
    mutationKey: ['feed', 'create-comment'],
    mutationFn: createFeedComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
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

  return { createComment, isError, isPending };
}
