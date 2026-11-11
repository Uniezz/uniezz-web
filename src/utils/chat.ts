import type { Conversation } from '@/@types';
import type { components } from '@/@types/schema';
import { authorName } from './feed';

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

/** An empty direct conversation with a match, opened from the connections list. */
export function connectionConversation(
  profile: components['schemas']['ProfileSummary'],
): Conversation {
  return {
    id: profile.id,
    name: authorName(profile),
    preview: '',
    time: '',
    group: false,
    unread: 0,
    image: 0,
    imageUrl: profile.avatarUrl ?? undefined,
    messages: [],
  };
}
