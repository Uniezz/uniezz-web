import { UISidebar } from '@/ui/components';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <div className="flex min-h-svh bg-white-secondary">
      <UISidebar
        className="sticky top-0 h-svh"
        user={CURRENT_USER}
        collapsed={collapsed}
        onCollapsedToggle={() => setCollapsed((value) => !value)}
      />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
