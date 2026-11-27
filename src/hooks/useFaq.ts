import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { FaqLanguage, FaqProposalRequest } from '@/@types';
import {
  ApiRequestError,
  approveFaqProposal,
  createFaqProposal,
  getFaqEntries,
  getMyFaqProposals,
  getPendingFaqProposals,
} from '@/api';
import i18n from '@/i18n';

export function useFaqEntries() {
  const { i18n } = useTranslation();
  // The language is in the key, so switching it loads the FAQ in the new one.
  const lang = (i18n.resolvedLanguage ?? 'pl') as FaqLanguage;
  return useInfiniteQuery({
    queryKey: ['faq', 'entries', lang],
    queryFn: ({ pageParam }) => getFaqEntries(lang, pageParam),
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

// Only moderators and admins may list pending proposals; a 403 means the moderation tab stays hidden.
export function usePendingFaqProposals() {
  return useInfiniteQuery({
    queryKey: ['faq', 'pending'],
    queryFn: ({ pageParam }) => getPendingFaqProposals(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    // Tab switches remount the list; mutations invalidate it, so 5 minutes is fresh enough.
    staleTime: 5 * 60_000,
    retry: (failureCount, error) =>
      !(error instanceof ApiRequestError && error.status === 403) && failureCount < 3,
  });
}

// Publishing moves the entry, with its text in every language, from pending to the public list; the author gets the coins.
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
