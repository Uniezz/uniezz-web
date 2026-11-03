import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/guide')({
  component: () => <Navigate to="/faq" replace />,
});
