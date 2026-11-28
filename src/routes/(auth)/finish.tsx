import { finishLogin } from '@/api';
import { FinishLoginPage } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/finish')({
  preload: false,
  loader: ({ location, context }) => finishLogin(location.search, context.queryClient),
  component: FinishPage,
  pendingComponent: FinishLoginPage,
});

function FinishPage() {
  const { error } = Route.useLoaderData();
  return <FinishLoginPage error={error} />;
}
