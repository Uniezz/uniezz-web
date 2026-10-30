import { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { CreateGroup } from '@/components/features/chat';
import { UIPanel } from '@/ui/components';
// TODO(api): Use the create-group API mutation instead of mock-state context.
import { ChatGroupRouteContext } from './route';

export const Route = createFileRoute('/_app/chat/new-group')({ component: NewGroupPage });

function NewGroupPage() {
  const context = useContext(ChatGroupRouteContext);
  if (!context) return null;

  return (
    <UIPanel className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-8">
      <CreateGroup onBack={context.onBack} onCreate={context.onCreate} />
    </UIPanel>
  );
}
