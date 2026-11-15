import { myProfileQueryOptions } from '@/hooks';
import { clearInviteCode, saveInviteCode } from '@/utils';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/invite/$code')({
  beforeLoad: async ({ params, context }) => {
    clearInviteCode();
    saveInviteCode(params.code);
    // A signed-in student applies the saved code on Rewards; a guest uses it when signing up.
    const signedIn = await context.queryClient
      .ensureQueryData({ ...myProfileQueryOptions(), retry: false })
      .then(
        () => true,
        () => false,
      );
    throw redirect({ to: signedIn ? '/rewards' : '/login', replace: true });
  },
  component: () => null,
});
