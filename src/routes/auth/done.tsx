import { finishLogin } from '@/api';
import { AuthLayout, FinishLoginPage } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/done')({
  preload: false,
  loader: ({ location, context }) => finishLogin(location.search, context.queryClient),
  component: DonePage,
  pendingComponent: () => (
    <AuthLayout>
      <FinishLoginPage />
    </AuthLayout>
  ),
});

function DonePage() {
  const { error } = Route.useLoaderData();
  return (
    <AuthLayout>
      <FinishLoginPage error={error} />
    </AuthLayout>
  );
}
