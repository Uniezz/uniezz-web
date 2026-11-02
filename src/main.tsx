import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouteMask, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkulletProvider } from 'skullet/react';

import './schemas/env';
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
  search: (search) => ({ ...search, postId: undefined }),
});
const newPostRouteMask = createRouteMask({
  routeTree,
  from: '/feed/post/new-post',
  to: '/feed/post/new-post',
  search: (search) => ({ ...search, feedRoute: undefined, postId: undefined }),
});
const profileRouteMask = createRouteMask({
  routeTree,
  from: '/connections/students/$profileId',
  to: '/connections/students/$profileId',
  params: true,
  search: ({ studentSearch }) => ({ studentSearch }),
});
const queryClient = new QueryClient();
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

createRoot(rootElement).render(
  <StrictMode>
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
  </StrictMode>,
);
