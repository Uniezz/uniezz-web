import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouteMask, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkulletProvider } from 'skullet/react';

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
const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  routeMasks: [newGroupRouteMask, connectionsRouteMask, postRouteMask, newPostRouteMask],
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
