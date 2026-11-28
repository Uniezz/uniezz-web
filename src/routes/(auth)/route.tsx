import { AuthLayout } from '@/components';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import { privateRouteHead } from '@/utils/routeHead';

// phones sign in here too; the app is offered once they reach the app pages, after onboarding (_app)
export const Route = createFileRoute('/(auth)')({
  head: ({ matches }) => privateRouteHead(matches[matches.length - 1]!.pathname),
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
