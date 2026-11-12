import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FaqProposalRequest } from '@/@types';
import { createFaqProposal, getFaqEntries, getMyFaqProposals, publishFaqEntry } from '@/api';

export function useFaqEntries() {
  return useInfiniteQuery({
    queryKey: ['faq'],
    queryFn: ({ pageParam }) => getFaqEntries(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useMyFaqProposals() {
  return useInfiniteQuery({
    queryKey: ['faq', 'proposals'],
    queryFn: ({ pageParam }) => getMyFaqProposals(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useCreateFaqProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'faq_proposal_create' },
    mutationFn: (body: FaqProposalRequest) => createFaqProposal(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['faq', 'proposals'] });
    },
  });
}

export function usePublishFaqEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'faq_publish' },
    mutationFn: (body: FaqProposalRequest) => publishFaqEntry(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['faq'] });
      void queryClient.invalidateQueries({ queryKey: ['faq', 'proposals'] });
    },
  });
}
