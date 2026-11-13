import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, RouterProvider, createRouteMask, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkulletProvider } from 'skullet/react';
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';
import './schemas/env';
import { createAnalyticsMutationCache, sanitizeAnalyticsEvent } from './utils/analytics';
import { routeTree } from './routeTree.gen';
import { useMyProfile } from './hooks';
import { ApiRequestError } from './api/errors';

import './i18n';

try {
  sessionStorage.removeItem('uniezz:access-token');
  sessionStorage.removeItem('uniezz:session-expires-at');
} catch {
  // Storage can be unavailable in private browsing.
}

const routeMasks = [
  createRouteMask({ routeTree, from: '/', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/login', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/otp', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/finish', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/auth/done', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/chat', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/chat/', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/chat/new-group', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/connections/', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/connections/students/', to: '/', search: () => ({}) }),
  createRouteMask({
    routeTree,
    from: '/connections/students/$profileId',
    to: '/',
    params: true,
    search: () => ({}),
  }),
  createRouteMask({ routeTree, from: '/exams', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/exams/courses/new', to: '/', search: () => ({}) }),
  createRouteMask({
    routeTree,
    from: '/exams/courses/$courseId/',
    to: '/',
    params: true,
    search: () => ({}),
  }),
  createRouteMask({
    routeTree,
    from: '/exams/courses/$courseId/edit',
    to: '/',
    params: true,
    search: () => ({}),
  }),
  createRouteMask({
    routeTree,
    from: '/exams/courses/$courseId/upload',
    to: '/',
    params: true,
    search: () => ({}),
  }),
  createRouteMask({ routeTree, from: '/faq', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/feed', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/feed/', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/feed/post/new-post', to: '/', search: () => ({}) }),
  createRouteMask({
    routeTree,
    from: '/feed/post/$postId',
    to: '/',
    params: true,
    search: () => ({}),
  }),
  createRouteMask({
    routeTree,
    from: '/feed/post/$postId/edit',
    to: '/',
    params: true,
    search: () => ({}),
  }),
  createRouteMask({ routeTree, from: '/guide', to: '/', search: () => ({}) }),
  createRouteMask({ routeTree, from: '/profile', to: '/', search: () => ({}) }),
];
const queryClient = new QueryClient({ mutationCache: createAnalyticsMutationCache(posthog) });
const router = createRouter({
  routeTree,
  routeMasks,
  context: { queryClient },
  stringifySearch: () => '',
  defaultNotFoundComponent: UnknownRouteRedirect,
  // Scroll is remembered per address, so returning to a page (Back opens it anew) restores it.
  scrollRestoration: ({ location }) =>
    !(
      location.pathname.startsWith('/exams/courses/') ||
      /^\/feed\/post\/(new-post\/?|[^/]+\/edit\/?)$/.test(location.pathname)
    ),
  getScrollRestorationKey: (location) => location.href,
});

function UnknownRouteRedirect() {
  const { error, isPending } = useMyProfile();
  if (isPending) return null;
  return (
    <Navigate
      to={error instanceof ApiRequestError && error.status === 401 ? '/' : '/feed'}
      replace
    />
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}
posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: 'latest',
  capture_pageview: 'history_change',
  capture_pageleave: true,
  disable_scroll_properties: false,
  autocapture: true,
  mask_all_text: true,
  mask_all_element_attributes: true,
  disable_session_recording: true,
  before_send: sanitizeAnalyticsEvent,
});

createRoot(rootElement).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <SkulletProvider
          mode="dark"
          theme={{
            dark: { base: 'rgb(255 255 255 / 0.2)', highlight: 'rgb(255 255 255 / 0.3)' },
            animation: 'pulse',
            radius: '0.375rem',
          }}
        >
          <RouterProvider router={router} />
        </SkulletProvider>
      </QueryClientProvider>
    </PostHogProvider>
  </StrictMode>,
);
