import type { ReportDecisionInput } from '@/@types';
import { api } from './client';

export async function getPendingReports(cursor?: string) {
  const { data } = await api.GET('/moderation/reports', { params: { query: { cursor } } });
  return data!;
}

export async function updateReport({ id, status }: ReportDecisionInput) {
  const { data } = await api.PATCH('/moderation/reports/{id}', {
    params: { path: { id } },
    body: { status },
  });
  return data!;
}

export async function removePost(id: string) {
  await api.DELETE('/moderation/posts/{id}', { params: { path: { id } } });
}

export async function removeComment(id: string) {
  await api.DELETE('/moderation/comments/{id}', { params: { path: { id } } });
}

export async function removeFile(id: string) {
  await api.DELETE('/moderation/files/{id}', { params: { path: { id } } });
}

export async function removeCourse(id: string) {
  await api.DELETE('/moderation/courses/{id}', { params: { path: { id } } });
}

export async function removeCourseComment(id: string) {
  await api.DELETE('/moderation/course-comments/{id}', { params: { path: { id } } });
}

export async function removeProfessorReview(id: string) {
  await api.DELETE('/moderation/professor-reviews/{id}', { params: { path: { id } } });
}

export async function getBan(id: string) {
  const { data } = await api.GET('/moderation/users/{id}/ban', { params: { path: { id } } });
  return data!;
}

export async function banUser(id: string) {
  await api.PUT('/moderation/users/{id}/ban', { params: { path: { id } } });
}

export async function unbanUser(id: string) {
  await api.DELETE('/moderation/users/{id}/ban', { params: { path: { id } } });
}

export async function getModerationActions(cursor?: string) {
  const { data } = await api.GET('/moderation/actions', { params: { query: { cursor } } });
  return data!;
}

export async function getModerators(cursor?: string) {
  const { data } = await api.GET('/moderation/moderators', { params: { query: { cursor } } });
  return data!;
}

export async function grantModerator(id: string) {
  await api.PUT('/moderation/moderators/{id}', { params: { path: { id } } });
}

export async function revokeModerator(id: string) {
  await api.DELETE('/moderation/moderators/{id}', { params: { path: { id } } });
}
