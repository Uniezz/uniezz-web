import { api } from './client';

export async function getFaqEntries(cursor?: string) {
  const { data } = await api.GET('/faq', { params: { query: { cursor } } });
  return data!;
}
