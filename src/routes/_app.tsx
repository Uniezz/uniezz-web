import { UISidebar } from '@/ui/components';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

const CURRENT_USER = {
  initials: 'DS',
  name: 'Dmytro Shevchuk',
  meta: 'Politechnika · 3rd year',
};

function AppLayout() {
  return (
    <div className="flex min-h-svh bg-white-secondary">
      <UISidebar className="sticky top-0 h-svh" user={CURRENT_USER} />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
