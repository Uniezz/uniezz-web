import { AuthLayout } from '@/components';
import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)')({
  component: AuthRoute,
});

function AuthRoute() {
  const isLogin = useLocation({ select: (location) => location.pathname === '/login' });
  return (
    <AuthLayout compact={isLogin}>
      <Outlet />
    </AuthLayout>
  );
}
