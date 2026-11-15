import { createFileRoute, useRouter } from '@tanstack/react-router';

import { myProfileQueryOptions } from '@/hooks';
import { UIQueryError } from '@/ui/components';
import { OnboardingWizard } from '@/components/features/onboarding';

export const Route = createFileRoute('/_app/onboarding')({
  loader: ({ context }) => context.queryClient.ensureQueryData(myProfileQueryOptions()),
  errorComponent: OnboardingError,
  component: OnboardingPage,
});

function OnboardingError() {
  const router = useRouter();
  return <UIQueryError retry={() => void router.invalidate()} />;
}

function OnboardingPage() {
  return <OnboardingWizard profile={Route.useLoaderData()} />;
}
