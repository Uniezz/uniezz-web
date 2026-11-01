import type { components } from '@/@types/schema';
import { api } from './client';

export async function getMyProfile() {
  const { data, error } = await api.GET('/profile/me');
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing profile response');
  return data;
}

export async function updateMyProfile(body: components['schemas']['UpdateMeInputBody']) {
  const { data, error } = await api.PATCH('/profile/me', { body });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing profile response');
  return data;
}

export async function saveProgramme(body: components['schemas']['ProgrammeRequest'], id?: string) {
  const { data, error } = id
    ? await api.PUT('/profile/programmes/{id}', { params: { path: { id } }, body })
    : await api.POST('/profile/programmes', { body });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing programme response');
  return data;
}

export async function deleteProgramme(id: string) {
  const { error, response } = await api.DELETE('/profile/programmes/{id}', {
    params: { path: { id } },
  });
  if (error && response.status !== 404) throw new Error(error.error);
}

export async function deleteMyAvatar() {
  const { error } = await api.DELETE('/profile/avatar');
  if (error) throw new Error(error.error);
}

export async function getProfiles(name: string, cursor?: string) {
  const { data, error } = await api.GET('/profiles', {
    params: { query: { name: name || undefined, cursor } },
  });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing profiles response');
  return data;
}

export async function getPublicProfile(id: string) {
  const { data, error } = await api.GET('/profiles/{id}', { params: { path: { id } } });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing profile response');
  return data;
}
