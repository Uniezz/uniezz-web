import type { components } from '@/@types/schema';
import { api } from './client';
import { isNewProfile, isOnboardingDone } from '@/utils';

export async function getMyProfile() {
  const { data } = await api.GET('/profile/me');
  return data!;
}

export async function updateMyProfile(body: components['schemas']['UpdateMeInputBody']) {
  const { data } = await api.PATCH('/profile/me', { body });
  return data!;
}

export async function deleteMyProfile() {
  await api.DELETE('/profile/me');
}

export async function saveProgramme(body: components['schemas']['ProgrammeRequest'], id?: string) {
  const { data } = id
    ? await api.PUT('/profile/programmes/{id}', { params: { path: { id } }, body })
    : await api.POST('/profile/programmes', { body });
  return data!;
}

export async function deleteProgramme(id: string) {
  await api.DELETE('/profile/programmes/{id}', {
    params: { path: { id } },
  });
}

export async function listMyProgrammes() {
  const { data } = await api.GET('/profile/programmes');
  return data!;
}

export async function deleteMyAvatar() {
  await api.DELETE('/profile/avatar');
}

export async function deleteMyBanner() {
  await api.DELETE('/profile/banner');
}

export async function getProfiles(q: string, cursor?: string) {
  const { data } = await api.GET('/profiles', {
    params: { query: { q: q || undefined, cursor } },
  });
  return data!;
}

export async function getPublicProfile(id: string) {
  const { data } = await api.GET('/profiles/{id}', { params: { path: { id } } });
  return data!;
}

/** Where a just-signed-in student lands: onboarding for a new account, otherwise the feed. */
export async function homeAfterSignIn(): Promise<'/onboarding' | '/feed'> {
  try {
    const { id, createdAt } = await getMyProfile();
    return isNewProfile(createdAt) && !isOnboardingDone(id) ? '/onboarding' : '/feed';
  } catch {
    return '/feed';
  }
}
