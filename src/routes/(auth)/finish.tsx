import { finishLogin } from '@/api';
import { FinishLoginPage } from '@/components';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { isMobileDevice, shouldBlockMobile } from '@/utils';

export const Route = createFileRoute('/(auth)/finish')({
  preload: false,
  beforeLoad: () => {
    if (
      shouldBlockMobile(
        isMobileDevice(navigator.userAgent, navigator.platform, navigator.maxTouchPoints),
        window.matchMedia('(max-width: 767px)').matches,
      )
    ) {
      throw redirect({ to: '/login', replace: true });
    }
  },
  loader: ({ location, context }) => finishLogin(location.search, context.queryClient),
  component: FinishPage,
  pendingComponent: FinishLoginPage,
});

function FinishPage() {
  const { error } = Route.useLoaderData();
  return <FinishLoginPage error={error} />;
}
