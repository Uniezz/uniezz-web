import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ConnectionFilters, Discovery } from '@/@types';
import {
  actOnCandidate,
  blockStudent,
  deleteConnection,
  discoverConnections,
  getConnections,
  getMyConnectionPreferences,
  unblockStudent,
  updateMyConnectionPreferences,
} from '@/api';
import { captureAnalytics } from '@/utils/analytics';

export function useDiscovery(filters: ConnectionFilters) {
  return useQuery({
    queryKey: ['connections', 'discover', filters],
    queryFn: () => discoverConnections(filters),
  });
}

export function useCandidateAction() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'connection_candidate_action' },
    mutationFn: actOnCandidate,
    onSuccess: ({ matched }, { candidateId }) => {
      if (matched) {
        captureAnalytics('connection_matched');
        void queryClient.invalidateQueries({ queryKey: ['connections', 'list'] });
      }
      let emptied = false;
      queryClient.setQueriesData<Discovery>({ queryKey: ['connections', 'discover'] }, (data) => {
        if (!data) return data;
        const items = data.items?.filter((card) => card.candidateId !== candidateId) ?? [];
        emptied ||= items.length === 0;
        return { ...data, items };
      });
      // The server skips students already liked or passed, so an empty batch means "fetch the next one".
      if (emptied) void queryClient.invalidateQueries({ queryKey: ['connections', 'discover'] });
    },
  });
}

export function useConnectionsList() {
  return useInfiniteQuery({
    queryKey: ['connections', 'list'],
    queryFn: ({ pageParam }) => getConnections(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useMyConnectionPreferences() {
  return useQuery({
    queryKey: ['connections', 'me'],
    queryFn: getMyConnectionPreferences,
  });
}

export function useUpdateMyConnectionPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['connections', 'preferences'],
    meta: { analyticsAction: 'connection_preferences_update' },
    mutationFn: updateMyConnectionPreferences,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['connections', 'me'] });
      void queryClient.invalidateQueries({ queryKey: ['connections', 'discover'] });
    },
  });
}

export function useBlockStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'connection_block' },
    mutationFn: blockStudent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['connections', 'list'] });
      void queryClient.invalidateQueries({ queryKey: ['connections', 'discover'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useUnblockStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'connection_unblock' },
    mutationFn: unblockStudent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['connections', 'list'] });
      void queryClient.invalidateQueries({ queryKey: ['connections', 'discover'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeleteConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'connection_delete' },
    mutationFn: deleteConnection,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['connections', 'list'] });
      void queryClient.invalidateQueries({ queryKey: ['connections', 'discover'] });
    },
  });
}
