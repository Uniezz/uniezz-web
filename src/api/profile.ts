import type { components } from '@/@types/schema';
import { api } from './client';

export async function getMyProfile() {
  const { data } = await api.GET('/profile/me');
  return data!;
}

export async function updateMyProfile(body: components['schemas']['UpdateMeInputBody']) {
  const { data } = await api.PATCH('/profile/me', { body });
  return data!;
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

export async function deleteMyAvatar() {
  await api.DELETE('/profile/avatar');
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
