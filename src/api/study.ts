import type {
  AddCourseCommentInput,
  AddCourseFileInput,
  CourseQuery,
  CreateCourseInput,
  StudyFileQuery,
  UpdateCourseInput,
} from '@/@types';
import { api } from './client';

export async function searchStudyFiles(query: StudyFileQuery, cursor?: string) {
  const { data } = await api.GET('/study/files', {
    params: { query: { limit: 20, ...query, cursor } },
  });
  return data!;
}

/** File links are short-lived, so a preview asks for a fresh one. */
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

export async function getCourse(id: string) {
  const { data } = await api.GET('/study/courses/{id}', { params: { path: { id } } });
  return data!;
}

export async function createCourse(body: CreateCourseInput) {
  const { data } = await api.POST('/study/courses', { body });
  return data!;
}

export async function updateCourse(id: string, body: UpdateCourseInput) {
  const { data } = await api.PATCH('/study/courses/{id}', { params: { path: { id } }, body });
  return data!;
}

export async function rateCourse({ id, rating }: { id: string; rating: number }) {
  const { data } = await api.PUT('/study/courses/{id}/rating', {
    params: { path: { id } },
    body: { rating },
  });
  return data!;
}

export async function getCourseComments(id: string, cursor?: string) {
  const { data } = await api.GET('/study/courses/{id}/comments', {
    params: { path: { id }, query: { limit: 20, cursor } },
  });
  return data!;
}

export async function addCourseComment(id: string, body: AddCourseCommentInput) {
  const { data } = await api.POST('/study/courses/{id}/comments', {
    params: { path: { id } },
    body,
  });
  return data!;
}

export async function getCourseFiles(id: string, cursor?: string) {
  const { data } = await api.GET('/study/courses/{id}/files', {
    params: { path: { id }, query: { limit: 20, cursor } },
  });
  return data!;
}

export async function addCourseFile(id: string, body: AddCourseFileInput) {
  const { data } = await api.POST('/study/courses/{id}/files', {
    params: { path: { id } },
    body,
  });
  return data!;
}

export async function getProfessors(universityId?: string, cursor?: string) {
  const { data } = await api.GET('/study/professors', {
    params: { query: { limit: 20, universityId, cursor } },
  });
  return data!;
}

export async function getProfessor(id: string) {
  const { data } = await api.GET('/study/professors/{id}', { params: { path: { id } } });
  return data!;
}

export async function rateProfessor({ id, rating }: { id: string; rating: number }) {
  const { data } = await api.PUT('/study/professors/{id}/rating', {
    params: { path: { id } },
    body: { rating },
  });
  return data!;
}

export async function deleteCourseComment(id: string) {
  await api.DELETE('/study/comments/{id}', { params: { path: { id } } });
}
