import type { components } from '@/@types/schema';
import type { UpdateMeBody } from '@/@types';
import { identifyAnalytics } from '@/utils/analytics';
import { api } from './client';

export async function getMyProfile() {
  const { data } = await api.GET('/profile/me');
  return data!;
}

export async function updateMyProfile(body: UpdateMeBody) {
  const { data } = await api.PATCH('/profile/me', { body });
  return data!;
}

export async function completeMyOnboarding() {
  await api.PUT('/profile/onboarding');
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

export async function listMyProfilePhotos() {
  const { data } = await api.GET('/profile/photos');
  return data!;
}

export async function addMyProfilePhoto(mediaId: string) {
  await api.POST('/profile/photos', { body: { mediaId } });
}

export async function deleteMyProfilePhoto(id: string) {
  await api.DELETE('/profile/photos/{id}', { params: { path: { id } } });
}

export async function reorderMyProfilePhotos(mediaIds: string[]) {
  await api.PUT('/profile/photos', { body: { mediaIds } });
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

/** Where a just-signed-in student lands: onboarding until it is finished or skipped, otherwise the feed. */
export async function homeAfterSignIn(
  authMethod: 'usos' | 'otp',
): Promise<'/onboarding' | '/feed'> {
  try {
    const profile = await getMyProfile();
    identifyAnalytics(profile, authMethod);
    return profile.onboardedAt ? '/feed' : '/onboarding';
  } catch {
    return '/feed';
  }
}
