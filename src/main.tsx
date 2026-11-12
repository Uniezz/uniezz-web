import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouteMask, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkulletProvider } from 'skullet/react';
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';
import './schemas/env';
import { createAnalyticsMutationCache, sanitizeAnalyticsEvent } from './utils/analytics';
import { routeTree } from './routeTree.gen';

import './i18n';

try {
  sessionStorage.removeItem('uniezz:access-token');
  sessionStorage.removeItem('uniezz:session-expires-at');
} catch {
  // Storage can be unavailable in private browsing.
}

const newGroupRouteMask = createRouteMask({
  routeTree,
  from: '/chat/new-group',
  to: '/chat/new-group',
  search: () => ({}),
});
const connectionsRouteMask = createRouteMask({
  routeTree,
  from: '/connections/',
  to: '/connections',
  search: () => ({}),
});
const studentsRouteMask = createRouteMask({
  routeTree,
  from: '/connections/students/',
  to: '/connections/students',
  search: ({ studentSearch }) => ({ studentSearch }),
});
const postRouteMask = createRouteMask({
  routeTree,
  from: '/feed/post/$postId',
  to: '/feed/post/$postId',
  params: true,
  search: (search) => ({ ...search, postFrom: undefined }),
});
const newPostRouteMask = createRouteMask({
  routeTree,
  from: '/feed/post/new-post',
  to: '/feed/post/new-post',
  search: (search) => ({ ...search, postFrom: undefined }),
});
const profileRouteMask = createRouteMask({
  routeTree,
  from: '/connections/students/$profileId',
  to: '/connections/students/$profileId',
  params: true,
  search: ({ studentSearch }) => ({ studentSearch }),
});
const queryClient = new QueryClient({ mutationCache: createAnalyticsMutationCache(posthog) });
const router = createRouter({
  routeTree,
  routeMasks: [
    newGroupRouteMask,
    connectionsRouteMask,
    studentsRouteMask,
    postRouteMask,
    newPostRouteMask,
    profileRouteMask,
  ],
  context: { queryClient },
  // Scroll is remembered per address, so returning to a page (Back opens it anew) restores it.
  scrollRestoration: ({ location }) =>
    !(
      location.pathname.startsWith('/exams/courses/') ||
      /^\/feed\/post\/(new-post\/?|[^/]+\/edit\/?)$/.test(location.pathname)
    ),
  getScrollRestorationKey: (location) => location.href,
});

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
