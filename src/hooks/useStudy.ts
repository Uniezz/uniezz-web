import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  deleteStudyFile,
  getCourses,
  getProfessors,
  rateCourse,
  rateProfessor,
  searchStudyFiles,
} from '@/api';
import type { CourseQuery, StudyFileQuery } from '@/@types';
import { patchCachedItem } from '@/utils/query';

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
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['study', 'files'] }),
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

export function useRateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'course_rate' },
    mutationFn: rateCourse,
    onSuccess: (course) => patchCachedItem(queryClient, ['study', 'courses'], course.id, course),
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

export function useRateProfessor() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { analyticsAction: 'professor_rate' },
    mutationFn: rateProfessor,
    onSuccess: (professor) =>
      patchCachedItem(queryClient, ['study', 'professors'], professor.id, professor),
  });
}
