import { finishLogin } from '@/api/finishLogin';
import { FinishLoginPage } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/finish')({
  preload: false,
  loader: ({ location, context }) => finishLogin(location.searchStr, context.queryClient),
  component: FinishPage,
  pendingComponent: FinishLoginPage,
});

function FinishPage() {
  const { error } = Route.useLoaderData();
  return <FinishLoginPage error={error} />;
}
