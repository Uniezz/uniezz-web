import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FaqProposalRequest } from '@/@types';
import {
  ApiRequestError,
  approveFaqProposal,
  createFaqProposal,
  getFaqEntries,
  getMyFaqProposals,
  getPendingFaqProposals,
  publishFaqEntry,
} from '@/api';
import i18n from '@/i18n';

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
    meta: {
      analyticsAction: 'faq_proposal_create',
      progress: () => i18n.t('progress.faqProposalCreate'),
    },
    mutationFn: (body: FaqProposalRequest) => createFaqProposal(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['faq', 'proposals'] });
    },
  });
}

export function usePublishFaqEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'faq_publish', progress: () => i18n.t('progress.faqPublish') },
    mutationFn: (body: FaqProposalRequest) => publishFaqEntry(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['faq'] });
      void queryClient.invalidateQueries({ queryKey: ['faq', 'proposals'] });
    },
  });
}

// Only FAQ publishers may list pending proposals; a 403 means the moderation tab stays hidden.
export function usePendingFaqProposals() {
  return useInfiniteQuery({
    queryKey: ['faq', 'pending'],
    queryFn: ({ pageParam }) => getPendingFaqProposals(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    retry: (failureCount, error) =>
      !(error instanceof ApiRequestError && error.status === 403) && failureCount < 3,
  });
}

// Publishing moves the entry from pending to the public list; the author gets the coins.
export function useApproveFaqProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'faq_approve', progress: () => i18n.t('progress.faqPublish') },
    mutationFn: approveFaqProposal,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });
}
