import { finishLogin } from '@/api/finishLogin';
import { AuthLayout, FinishLoginPage } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/callback')({
  preload: false,
  loader: ({ location }) => finishLogin(location.searchStr),
  component: CallbackPage,
  pendingComponent: () => (
    <AuthLayout>
      <FinishLoginPage />
    </AuthLayout>
  ),
});

function CallbackPage() {
  const { error } = Route.useLoaderData();
  return (
    <AuthLayout>
      <FinishLoginPage error={error} />
    </AuthLayout>
  );
}
