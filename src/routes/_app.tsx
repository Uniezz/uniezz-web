import { UISidebar } from '@/ui/components';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

const CURRENT_USER = {
  initials: 'DS',
  name: 'Dmytro Shevchuk',
  meta: 'Politechnika · 3rd year',
};

const SIDEBAR_STORAGE_KEY = 'uniezz:sidebar-collapsed';

function AppLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true',
  );

  const toggleCollapsed = useCallback(() => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
  }, [collapsed]);

  return (
    <div className="flex min-h-svh bg-white-secondary">
      <UISidebar
        className="sticky top-0 h-svh"
        user={CURRENT_USER}
        collapsed={collapsed}
        onCollapsedToggle={toggleCollapsed}
      />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
