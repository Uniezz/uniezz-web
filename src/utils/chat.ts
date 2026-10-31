import type { Conversation } from '@/@types';

// TODO(api): Replace this local mock group factory with the create-group API mutation.
export function createGroupConversation(
  conversations: Conversation[],
  name: string,
  members: string[],
  imageUrl?: string,
): Conversation {
  return {
    id: `group-${conversations.length + 1}`,
    name: conversations.some((conversation) => conversation.name === name)
      ? `${name} (${conversations.length + 1})`
      : name,
    preview: members.join(', '),
    time: '',
    group: true,
    unread: 0,
    image: 0,
    imageUrl,
    messages: [],
  };
}
