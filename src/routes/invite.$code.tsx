import { clearInviteCode, saveInviteCode } from '@/utils';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/invite/$code')({
  beforeLoad: ({ params }) => {
    clearInviteCode();
    saveInviteCode(params.code);
    throw redirect({ to: '/login', replace: true });
  },
  component: () => null,
});
