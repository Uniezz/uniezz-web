import type { Middleware } from 'openapi-fetch';
import type { paths } from '@/@types/schema';
import { OTP_REQUEST_ERRORS, OTP_VERIFY_ERRORS } from '@/utils/otp';

type EndpointErrors = { statuses: Record<number, string>; fallback: string };
const ENDPOINT_ERRORS: Partial<Record<string, EndpointErrors>> = {
  '/auth/otp/request': {
    statuses: OTP_REQUEST_ERRORS,
    fallback: 'Couldn’t send the code. Try again.',
  },
  '/auth/otp/verify': {
    statuses: OTP_VERIFY_ERRORS,
    fallback: 'Couldn’t verify the code. Try again.',
  },
} satisfies Partial<Record<keyof paths, EndpointErrors>>;

export class ApiRequestError extends Error {
  constructor(
    operation: string,
    detail: string,
    message?: string,
    cause?: unknown,
    public readonly status?: number,
  ) {
    super(message ?? `${operation}: ${detail}`, { cause });
    this.name = 'ApiRequestError';
  }
}

/** The backend's error code, such as `dating_requires_adult`, when the error carries one. */
export function apiErrorCode(error: unknown): string | undefined {
  const cause = error instanceof ApiRequestError ? error.cause : undefined;
  return cause && typeof cause === 'object' && 'error' in cause && typeof cause.error === 'string'
    ? cause.error
    : undefined;
}

export function apiError(
  operation: string,
  response: Response,
  error?: { error: string },
  message?: string,
): ApiRequestError {
  const status = `${response.status} ${response.statusText}`.trim();
  const detail = error
    ? `HTTP ${status}, backend code ${error.error}`
    : response.ok
      ? `HTTP ${status}, expected response body is missing`
      : `HTTP ${status}, backend returned no error body`;
  return new ApiRequestError(operation, detail, message, error, response.status);
}

export const apiMiddleware: Middleware = {
  async onResponse({ request, response, schemaPath }) {
    if (
      response.status === 401 &&
      !schemaPath.startsWith('/auth/') &&
      schemaPath !== '/profile/me'
    ) {
      window.location.replace('/login');
    }
    if (response.ok) {
      // Adding a profile photo answers 201 with no body.
      const isEmptyCreated =
        response.status === 201 && request.method === 'POST' && schemaPath === '/profile/photos';
      if (response.status === 204 || isEmptyCreated) {
        const allowsNoContent =
          isEmptyCreated ||
          (request.method === 'PUT' &&
            [
              '/connections/blocks/{id}',
              '/profile/photos',
              '/moderation/moderators/{id}',
              '/moderation/users/{id}/ban',
              '/profile/onboarding',
              '/media/images/{id}/review',
            ].includes(schemaPath)) ||
          (request.method === 'POST' &&
            ['/auth/otp/request', '/auth/otp/verify', '/auth/exchange'].includes(schemaPath)) ||
          (request.method === 'DELETE' &&
            [
              '/chat/messages/{id}',
              '/feed/comments/{id}',
              '/feed/posts/{id}',
              '/profile/avatar',
              '/profile/programmes/{id}',
              '/connections/{id}',
              '/connections/blocks/{id}',
              '/study/comments/{id}',
              '/study/courses/{id}',
              '/study/files/{id}',
              '/profile/banner',
              '/profile/me',
              '/profile/photos/{id}',
              '/moderation/comments/{id}',
              '/moderation/courses/{id}',
              '/moderation/files/{id}',
              '/moderation/posts/{id}',
              '/moderation/course-comments/{id}',
              '/moderation/professor-reviews/{id}',
              '/study/professors/{id}/review',
              '/moderation/moderators/{id}',
              '/moderation/users/{id}/ban',
              '/rewards/challenges/{id}',
              '/media/images/{id}',
            ].includes(schemaPath));
        if (!allowsNoContent) {
          throw apiError(`${request.method} ${schemaPath}`, response);
        }
      } else if (request.method !== 'HEAD') {
        const body = (await response.clone().text()).trim();
        if (!body || body === 'null') {
          throw apiError(`${request.method} ${schemaPath}`, response);
        }
      }
      return;
    }
    if (
      request.method === 'DELETE' &&
      schemaPath === '/profile/programmes/{id}' &&
      response.status === 404
    ) {
      return;
    }

    const body: unknown = await response
      .clone()
      .json()
      .catch(() => null);
    const code =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : undefined;
    const errors = ENDPOINT_ERRORS[schemaPath];
    const message = errors?.statuses[response.status] ?? errors?.fallback;
    throw apiError(
      `${request.method} ${schemaPath}`,
      response,
      code ? { error: code } : undefined,
      message,
    );
  },
  onError({ request, schemaPath, error }) {
    const message = ENDPOINT_ERRORS[schemaPath]?.fallback;
    return new ApiRequestError(
      `${request.method} ${schemaPath}`,
      `request failed before an HTTP response: ${error instanceof Error ? error.message : String(error)}`,
      message,
      error,
    );
  },
};
