import { finishLogin } from '@/api';
import { AuthLayout, FinishLoginPage } from '@/components';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { isMobileDevice, shouldBlockMobile } from '@/utils';

export const Route = createFileRoute('/auth/done')({
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
