import type { ConnectionFilters } from '@/@types';
import type { components } from '@/@types/schema';
import { toDiscoverQuery } from '@/utils/connections';
import { api } from './client';

export async function discoverConnections(filters: ConnectionFilters) {
  const { data } = await api.GET('/connections/discover', {
    params: { query: toDiscoverQuery(filters) },
  });
  return data!;
}

export async function actOnCandidate({
  candidateId,
  ...body
}: { candidateId: string } & components['schemas']['ActOnCandidateInputBody']) {
  const { data } = await api.PUT('/connections/candidates/{id}', {
    params: { path: { id: candidateId } },
    body,
  });
  return data!;
}

export async function getConnections(cursor?: string) {
  const { data } = await api.GET('/connections', { params: { query: { cursor } } });
  return data!;
}
