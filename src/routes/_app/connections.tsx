import { UIText } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/connections')({
  component: ConnectionsPage,
});

function ConnectionsPage() {
  return (
    <div className="p-8">
      <UIText as="h1" size="xxl" weight="bold">
        Connections
      </UIText>
    </div>
  );
}
