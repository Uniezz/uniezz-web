/** One place for chat query keys, so a cache update and its query never use different keys. */
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (conversationId: string) =>
    [...chatKeys.all, 'conversation', conversationId] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
};
