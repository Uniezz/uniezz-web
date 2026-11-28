import { createFileRoute } from '@tanstack/react-router';

import { GroupSettingsScreen } from '@/components/features/chat';

export const Route = createFileRoute('/_app/chat/group/$conversationId')({
  component: GroupSettingsPage,
});

function GroupSettingsPage() {
  const { conversationId } = Route.useParams();
  return <GroupSettingsScreen conversationId={conversationId} />;
}
