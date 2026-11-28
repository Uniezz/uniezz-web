/** One place for chat query keys, so a cache update and its query never use different keys. */
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (conversationId: string) =>
    [...chatKeys.all, 'conversation', conversationId] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
  members: (conversationId: string) => [...chatKeys.all, 'members', conversationId] as const,
  requests: () => [...chatKeys.all, 'requests'] as const,
  unread: () => [...chatKeys.all, 'unread'] as const,
  settings: () => [...chatKeys.all, 'settings'] as const,
};
