import { queryOptions, useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/api';

export function myProfileQueryOptions() {
  return queryOptions({ queryKey: ['profile', 'me'], queryFn: getMyProfile });
}

export function useMyProfile() {
  return useQuery(myProfileQueryOptions());
}
