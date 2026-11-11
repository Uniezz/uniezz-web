import type { CourseQuery, StudyFileQuery } from '@/@types';
import { api } from './client';

export async function searchStudyFiles(query: StudyFileQuery, cursor?: string) {
  const { data } = await api.GET('/study/files', {
    params: { query: { limit: 20, ...query, cursor } },
  });
  return data!;
}

/** File links are short-lived, so a download asks for a fresh one. */
export async function getStudyFile(id: string) {
  const { data } = await api.GET('/study/files/{id}', { params: { path: { id } } });
  return data!;
}

export async function deleteStudyFile(id: string) {
  await api.DELETE('/study/files/{id}', { params: { path: { id } } });
}

export async function getCourses(query: CourseQuery, cursor?: string) {
  const { data } = await api.GET('/study/courses', {
    params: { query: { limit: 20, ...query, cursor } },
  });
  return data!;
}

export async function rateCourse({ id, rating }: { id: string; rating: number }) {
  const { data } = await api.PUT('/study/courses/{id}/rating', {
    params: { path: { id } },
    body: { rating },
  });
  return data!;
}

export async function getProfessors(universityId?: string, cursor?: string) {
  const { data } = await api.GET('/study/professors', {
    params: { query: { limit: 20, universityId, cursor } },
  });
  return data!;
}

export async function rateProfessor({ id, rating }: { id: string; rating: number }) {
  const { data } = await api.PUT('/study/professors/{id}/rating', {
    params: { path: { id } },
    body: { rating },
  });
  return data!;
}
