import type { ChallengeCreateBody, ChallengeUpdateInput } from '@/@types';
import { api } from './client';

export async function getMyCoinGrants(cursor?: string) {
  const { data } = await api.GET('/rewards/me/grants', {
    params: { query: { cursor, limit: 20 } },
  });
  return data!;
}

export async function getMyDailyQuests() {
  const { data } = await api.GET('/rewards/me/quests');
  return data!;
}

// shortcut: only the first 50 running challenges, page with nextCursor if staff ever runs more.
export async function getMyChallenges() {
  const { data } = await api.GET('/rewards/me/challenges', { params: { query: { limit: 50 } } });
  return data!;
}

export async function getChallenges(cursor?: string) {
  const { data } = await api.GET('/rewards/challenges', { params: { query: { cursor } } });
  return data!;
}

export async function createChallenge(body: ChallengeCreateBody) {
  const { data } = await api.POST('/rewards/challenges', { body });
  return data!;
}

export async function updateChallenge({ id, body }: ChallengeUpdateInput) {
  const { data } = await api.PATCH('/rewards/challenges/{id}', { params: { path: { id } }, body });
  return data!;
}

export async function archiveChallenge(id: string) {
  await api.DELETE('/rewards/challenges/{id}', { params: { path: { id } } });
}
