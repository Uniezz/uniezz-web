import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'react-hot-toast';

import '../globals.css';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        gutter={10}
        containerStyle={{ top: 24, right: 24 }}
        toastOptions={{
          duration: 3500,
          style: {
            maxWidth: 'calc(100vw - 32px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            background: 'rgba(22, 24, 34, 0.96)',
            padding: '12px 16px',
            color: '#fff',
            fontFamily: 'Geist Variable, sans-serif',
            fontSize: 14,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
          },
          success: { duration: 3000, iconTheme: { primary: '#3dd68c', secondary: '#161822' } },
          error: { iconTheme: { primary: '#e5484d', secondary: '#fff' } },
        }}
      />
      <TanStackRouterDevtools />
    </>
  );
}
