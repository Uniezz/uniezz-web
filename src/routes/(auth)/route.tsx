import { AuthLayout } from '@/components';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)')({
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
