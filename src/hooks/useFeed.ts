import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFeedComment,
  getCommentReplies,
  getFeedComments,
  getFeedPost,
  getFeedPosts,
} from '@/api';
import type { FeedFilters } from '@/@types';

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
  return useMutation({
    mutationKey: ['feed', 'create-comment'],
    mutationFn: createFeedComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });
}
