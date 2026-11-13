import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  addCourseComment,
  addCourseFile,
  createCourse,
  deleteStudyFile,
  deleteCourseComment,
  getCourse,
  getCourseComments,
  getCourseFiles,
  getCourses,
  getProfessor,
  getProfessors,
  rateCourse,
  rateProfessor,
  searchStudyFiles,
  updateCourse,
  uploadStudyMaterial,
} from '@/api';
import type {
  AddCourseCommentInput,
  AddCourseFileInput,
  CourseQuery,
  CreateCourseInput,
  StudyFileQuery,
  UpdateCourseInput,
} from '@/@types';
import { patchCachedItem } from '@/utils';

export function useStudyFiles(query: StudyFileQuery) {
  return useInfiniteQuery({
    queryKey: ['study', 'files', query],
    queryFn: ({ pageParam }) => searchStudyFiles(query, pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useDeleteStudyFile() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'study_file_delete' },
    mutationFn: deleteStudyFile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'files'] });
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
    },
  });
}

export function useCourses(query: CourseQuery) {
  return useInfiniteQuery({
    queryKey: ['study', 'courses', query],
    queryFn: ({ pageParam }) => getCourses(query, pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['study', 'courses', id],
    queryFn: () => getCourse(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_create' },
    mutationFn: (body: CreateCourseInput) => createCourse(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_update' },
    mutationFn: ({ id, body }: { id: string; body: UpdateCourseInput }) => updateCourse(id, body),
    onSuccess: (course) => patchCachedItem(queryClient, ['study', 'courses'], course.id, course),
  });
}

export function useRateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_rate' },
    mutationFn: rateCourse,
    onSuccess: (course) => patchCachedItem(queryClient, ['study', 'courses'], course.id, course),
  });
}

export function useCourseComments(courseId: string) {
  return useInfiniteQuery({
    queryKey: ['study', 'courses', courseId, 'comments'],
    queryFn: ({ pageParam }) => getCourseComments(courseId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: !!courseId,
  });
}

export function useAddCourseComment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_comment_add' },
    mutationFn: ({ courseId, body }: { courseId: string; body: AddCourseCommentInput }) =>
      addCourseComment(courseId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
    },
  });
}

export function useCourseFiles(courseId: string) {
  return useInfiniteQuery({
    queryKey: ['study', 'courses', courseId, 'files'],
    queryFn: ({ pageParam }) => getCourseFiles(courseId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: !!courseId,
  });
}

export function useAddCourseFile() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_file_add' },
    mutationFn: ({ courseId, body }: { courseId: string; body: AddCourseFileInput }) =>
      addCourseFile(courseId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
      void queryClient.invalidateQueries({ queryKey: ['study', 'files'] });
    },
  });
}

export function useProfessors(universityId?: string) {
  return useInfiniteQuery({
    queryKey: ['study', 'professors', universityId],
    queryFn: ({ pageParam }) => getProfessors(universityId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useProfessor(id: string) {
  return useQuery({
    queryKey: ['study', 'professors', id],
    queryFn: () => getProfessor(id),
    enabled: !!id,
  });
}

export function useRateProfessor() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'professor_rate' },
    mutationFn: rateProfessor,
    onSuccess: (professor) =>
      patchCachedItem(queryClient, ['study', 'professors'], professor.id, professor),
  });
}

export function useDeleteCourseComment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_comment_delete' },
    mutationFn: deleteCourseComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
    },
  });
}

export function useUploadStudyMaterial() {
  return useMutation({
    meta: { analyticsAction: 'study_material_upload' },
    mutationFn: async (file: File) => ({ file, mediaId: await uploadStudyMaterial(file) }),
  });
}
