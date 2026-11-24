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
  deleteCourse,
  deleteStudyFile,
  deleteCourseComment,
  deleteMyProfessorReview,
  getCourse,
  getCourseComments,
  getCourseFiles,
  getCourses,
  getProfessor,
  getProfessorReviews,
  getProfessors,
  rateCourse,
  rateProfessor,
  reviewProfessor,
  searchStudyFiles,
  updateCourse,
  uploadStudyMaterial,
} from '@/api';
import type {
  AddCourseCommentInput,
  AddCourseFileInput,
  CourseQuery,
  CreateCourseInput,
  ProfessorQuery,
  StudyFileQuery,
  UpdateCourseInput,
} from '@/@types';
import { patchCachedItem } from '@/utils';
import i18n from '@/i18n';

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
    meta: {
      analyticsAction: 'study_file_delete',
      progress: () => i18n.t('progress.studyFileDelete'),
    },
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
    meta: { analyticsAction: 'course_create', progress: () => i18n.t('courses.creatingCourse') },
    mutationFn: (body: CreateCourseInput) => createCourse(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_update', progress: () => i18n.t('progress.courseUpdate') },
    mutationFn: ({ id, body }: { id: string; body: UpdateCourseInput }) => updateCourse(id, body),
    onSuccess: (course) => patchCachedItem(queryClient, ['study', 'courses'], course.id, course),
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_delete', progress: () => i18n.t('progress.courseDelete') },
    mutationFn: deleteCourse,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['study', 'courses', id] });
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
      void queryClient.invalidateQueries({ queryKey: ['study', 'files'] });
    },
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
    meta: {
      analyticsAction: 'course_comment_add',
      progress: () => i18n.t('progress.commentCreate'),
    },
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
    meta: { analyticsAction: 'course_file_add', progress: () => i18n.t('progress.courseFileAdd') },
    mutationFn: ({ courseId, body }: { courseId: string; body: AddCourseFileInput }) =>
      addCourseFile(courseId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
      void queryClient.invalidateQueries({ queryKey: ['study', 'files'] });
    },
  });
}

export function useProfessors(query: ProfessorQuery) {
  return useInfiniteQuery({
    queryKey: ['study', 'professors', query],
    queryFn: ({ pageParam }) => getProfessors(query, pageParam),
    placeholderData: keepPreviousData,
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

export function useProfessorReviews(professorId: string) {
  return useInfiniteQuery({
    queryKey: ['study', 'professors', professorId, 'reviews'],
    queryFn: ({ pageParam }) => getProfessorReviews(professorId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useReviewProfessor() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'professor_review', progress: () => i18n.t('progress.reviewSave') },
    mutationFn: reviewProfessor,
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'professors', id, 'reviews'] });
    },
  });
}

export function useDeleteProfessorReview() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      analyticsAction: 'professor_review_delete',
      progress: () => i18n.t('progress.reviewDelete'),
    },
    mutationFn: deleteMyProfessorReview,
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'professors', id, 'reviews'] });
    },
  });
}

export function useDeleteCourseComment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      analyticsAction: 'course_comment_delete',
      progress: () => i18n.t('progress.commentDelete'),
    },
    mutationFn: deleteCourseComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['study', 'courses'] });
    },
  });
}

export function useUploadStudyMaterial() {
  return useMutation({
    meta: {
      analyticsAction: 'study_material_upload',
      progress: () => i18n.t('courses.uploadingMaterials'),
    },
    mutationFn: async (file: File) => ({ file, mediaId: await uploadStudyMaterial(file) }),
  });
}
