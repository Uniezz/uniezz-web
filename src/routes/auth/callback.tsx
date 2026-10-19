import { AuthLayout } from '@/components';
import { FinishPage } from '../(auth)/finish';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/callback')({
  component: () => (
    <AuthLayout>
      <FinishPage />
    </AuthLayout>
  ),
});
