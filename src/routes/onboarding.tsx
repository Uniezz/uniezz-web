import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';

import { ApiRequestError } from '@/api';
import { myProfileQueryOptions } from '@/hooks';
import { UIQueryError } from '@/ui/components';
import { OnboardingWizard } from '@/components/features/onboarding';
import { privateRouteHead } from '@/utils/routeHead';

// Standalone page, outside the app layout: once skipped or finished it redirects to the feed for good.
export const Route = createFileRoute('/onboarding')({
  head: () => privateRouteHead('/onboarding'),
  beforeLoad: async ({ context }) => {
    try {
      const { onboardedAt } = await context.queryClient.ensureQueryData(myProfileQueryOptions());
      if (onboardedAt) throw redirect({ to: '/feed', replace: true });
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        throw redirect({ to: '/login', replace: true });
      }
      throw error;
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(myProfileQueryOptions()),
  errorComponent: OnboardingError,
  pendingComponent: OnboardingPending,
  component: OnboardingPage,
});

function OnboardingError() {
  const router = useRouter();
  return <UIQueryError retry={() => void router.invalidate()} />;
}

// the mobile app's loading onboarding: a spinner on the page
function OnboardingPending() {
  return (
    <div role="status" className="grid min-h-svh place-items-center bg-ink">
      <LoaderCircle size={24} aria-hidden className="text-white motion-safe:animate-spin" />
    </div>
  );
}

function OnboardingPage() {
  return <OnboardingWizard profile={Route.useLoaderData()} />;
}
