import type {
  ActOnCandidateInput,
  ConnectionFilters,
  UpdateConnectionPreferencesInput,
} from '@/@types';
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
}: { candidateId: string } & ActOnCandidateInput) {
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

export async function blockStudent(id: string) {
  await api.PUT('/connections/blocks/{id}', { params: { path: { id } } });
}

export async function unblockStudent(id: string) {
  await api.DELETE('/connections/blocks/{id}', { params: { path: { id } } });
}

export async function deleteConnection(id: string) {
  await api.DELETE('/connections/{id}', { params: { path: { id } } });
}

export async function getMyConnectionPreferences() {
  const { data } = await api.GET('/connections/me');
  return data!;
}

export async function updateMyConnectionPreferences(body: UpdateConnectionPreferencesInput) {
  const { data } = await api.PATCH('/connections/me', { body });
  return data!;
}
