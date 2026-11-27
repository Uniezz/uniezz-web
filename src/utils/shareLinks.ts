import { ApiRequestError } from '@/api/errors';
import { returnPathSchema } from '@/schemas/routeSearch';
import { SITE_ORIGIN } from '@/utils/site';

// https links, so they open the app where it's installed and this site elsewhere, like invites.
export const postUrl = (id: string) => `${SITE_ORIGIN}/feed/post/${encodeURIComponent(id)}`;
export const profileUrl = (id: string) =>
  `${SITE_ORIGIN}/connections/students/${encodeURIComponent(id)}`;
export const professorUrl = (id: string) =>
  `${SITE_ORIGIN}/exams?${new URLSearchParams({ tab: 'professors', professor: id })}`;
export const courseUrl = (id: string) => `${SITE_ORIGIN}/exams/courses/${encodeURIComponent(id)}`;

/** A shared link to something deleted, hidden or mistyped: the backend answers 404, or 400 for a broken id. */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiRequestError && (error.status === 404 || error.status === 400);
}

/** Retry a failed load, except when the thing is gone, so the not-found screen shows at once. */
export function retryUnlessNotFound(failureCount: number, error: unknown): boolean {
  return !isNotFoundError(error) && failureCount < 3;
}

const RETURN_PATH_KEY = 'uniezz:return-path';

/** Remembers the page a guest opened, so signing in lands there instead of the feed. */
export function saveReturnPath(path: string): void {
  try {
    sessionStorage.setItem(RETURN_PATH_KEY, path);
  } catch {
    // Without storage the student lands on the feed.
  }
}

export function takeReturnPath(): string | undefined {
  try {
    const path = sessionStorage.getItem(RETURN_PATH_KEY);
    sessionStorage.removeItem(RETURN_PATH_KEY);
    return returnPathSchema.parse(path ?? undefined);
  } catch {
    return undefined;
  }
}
