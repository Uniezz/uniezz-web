import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouteMask, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './schemas/env';
import { routeTree } from './routeTree.gen';

import './i18n';

const newGroupRouteMask = createRouteMask({
  routeTree,
  from: '/chat/new-group',
  to: '/chat/new-group',
  search: () => ({}),
});
const connectionsRouteMask = createRouteMask({
  routeTree,
  from: '/connections',
  to: '/connections',
  search: () => ({}),
});
const postRouteMask = createRouteMask({
  routeTree,
  from: '/feed/$postId',
  to: '/feed/$postId',
  params: true,
  search: (search) => ({ ...search, postId: undefined }),
});
const newPostRouteMask = createRouteMask({
  routeTree,
  from: '/feed/new-post',
  to: '/feed/new-post',
  search: (search) => ({ ...search, feedRoute: undefined, postId: undefined }),
});
const router = createRouter({
  routeTree,
  routeMasks: [newGroupRouteMask, connectionsRouteMask, postRouteMask, newPostRouteMask],
});
const queryClient = new QueryClient();

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
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
