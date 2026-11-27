import { apiErrorCode } from '@/api/errors';

/** The toast for a failed write: the reason when the student can fix it, otherwise the fallback. */
export function apiErrorKey<Fallback extends string = 'apiState.error'>(
  error: unknown,
  fallback: Fallback = 'apiState.error' as Fallback,
): Fallback | 'apiState.contentNotAllowed' {
  return apiErrorCode(error) === 'content_not_allowed' ? 'apiState.contentNotAllowed' : fallback;
}
