import type { FaqLanguage, FaqProposalRequest, FaqTexts } from '@/@types';
import { api } from './client';

export async function getFaqEntries(lang: FaqLanguage, cursor?: string) {
  const { data } = await api.GET('/faq', { params: { query: { cursor, lang } } });
  return data!;
}

export async function getMyFaqProposals(cursor?: string) {
  const { data } = await api.GET('/faq/proposals', { params: { query: { cursor } } });
  return data!;
}

export async function createFaqProposal(body: FaqProposalRequest) {
  const { data } = await api.POST('/faq/proposals', { body });
  return data!;
}

export async function getPendingFaqProposals(cursor?: string) {
  const { data } = await api.GET('/faq/proposals/pending', { params: { query: { cursor } } });
  return data!;
}

export async function approveFaqProposal({ id, texts }: { id: string; texts: FaqTexts }) {
  const { data } = await api.PUT('/faq/proposals/{id}/approval', {
    params: { path: { id } },
    body: { texts },
  });
  return data!;
}
