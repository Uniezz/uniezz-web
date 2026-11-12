import type { FaqProposalRequest } from '@/@types';
import { api } from './client';

export async function getFaqEntries(cursor?: string) {
  const { data } = await api.GET('/faq', { params: { query: { cursor } } });
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

export async function publishFaqEntry(body: FaqProposalRequest) {
  const { data } = await api.POST('/faq', { body });
  return data!;
}
