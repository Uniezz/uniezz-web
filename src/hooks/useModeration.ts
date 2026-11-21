import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  banUser,
  getBan,
  getModerationActions,
  getModerators,
  getPendingReports,
  grantModerator,
  removeComment,
  removeCourse,
  removeFile,
  removePost,
  revokeModerator,
  unbanUser,
  updateReport,
} from '@/api';
import type { RemovableTarget, RemoveContentInput } from '@/@types';
import i18n from '@/i18n';

export function usePendingReports() {
  return useInfiniteQuery({
    queryKey: ['moderation', 'reports'],
    queryFn: ({ pageParam }) => getPendingReports(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    // Tab switches remount the list; mutations invalidate it, so 5 minutes is fresh enough.
    staleTime: 5 * 60_000,
  });
}

// Admins only: the log tab renders for admins alone.
export function useModerationActions() {
  return useInfiniteQuery({
    queryKey: ['moderation', 'actions'],
    queryFn: ({ pageParam }) => getModerationActions(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    // Tab switches remount the list; mutations invalidate it, so 5 minutes is fresh enough.
    staleTime: 5 * 60_000,
  });
}

// Admins only: the moderators tab renders for admins alone.
export function useModerators() {
  return useInfiniteQuery({
    queryKey: ['moderation', 'moderators'],
    queryFn: ({ pageParam }) => getModerators(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    // Tab switches remount the list; mutations invalidate it, so 5 minutes is fresh enough.
    staleTime: 5 * 60_000,
  });
}

export function useBan(userId: string) {
  return useQuery({
    queryKey: ['moderation', 'ban', userId],
    queryFn: () => getBan(userId),
  });
}

// Settling a report also settles every other pending report on the same target.
export function useReviewReport() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'report_review', progress: () => i18n.t('progress.reportReview') },
    mutationFn: (id: string) => updateReport({ id, status: 'reviewed' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['moderation'] });
    },
  });
}

export function useDismissReport() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'report_dismiss', progress: () => i18n.t('progress.reportDismiss') },
    mutationFn: (id: string) => updateReport({ id, status: 'dismissed' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['moderation'] });
    },
  });
}

// Removal also marks the content's pending reports reviewed and drops it from feed and study lists.
export function useRemoveContent() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'content_remove', progress: () => i18n.t('progress.contentRemove') },
    mutationFn: ({ type, id }: RemoveContentInput) => {
      const remove = {
        post: removePost,
        comment: removeComment,
        file: removeFile,
        course: removeCourse,
      } satisfies Record<RemovableTarget, (id: string) => Promise<void>>;
      return remove[type](id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['moderation'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      void queryClient.invalidateQueries({ queryKey: ['study'] });
    },
  });
}

// A ban also marks pending reports about the student reviewed.
export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'user_ban', progress: () => i18n.t('progress.userBan') },
    mutationFn: banUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['moderation'] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'user_unban', progress: () => i18n.t('progress.userUnban') },
    mutationFn: unbanUser,
    onSuccess: (_, userId) => {
      void queryClient.invalidateQueries({ queryKey: ['moderation', 'ban', userId] });
      void queryClient.invalidateQueries({ queryKey: ['moderation', 'actions'] });
    },
  });
}

export function useGrantModerator() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'moderator_grant', progress: () => i18n.t('progress.moderatorGrant') },
    mutationFn: grantModerator,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['moderation', 'moderators'] });
      void queryClient.invalidateQueries({ queryKey: ['moderation', 'actions'] });
    },
  });
}

export function useRevokeModerator() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      analyticsAction: 'moderator_revoke',
      progress: () => i18n.t('progress.moderatorRevoke'),
    },
    mutationFn: revokeModerator,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['moderation', 'moderators'] });
      void queryClient.invalidateQueries({ queryKey: ['moderation', 'actions'] });
    },
  });
}
