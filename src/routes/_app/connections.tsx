import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';

export const Route = createFileRoute('/_app/connections')({
  component: ConnectionsPage,
});

function ConnectionsPage() {
  return (
    <>
      <UITopbar
        title="Connections"
        subtitle="Meet students across all five universities"
        action={{ label: 'Edit preferences', icon: Pencil }}
      />
      <div className="p-8" />
    </>
  );
}
