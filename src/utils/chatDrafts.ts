/** Unsent text per chat. It stays while the app is open and is lost on reload. */
const drafts = new Map<string, string>();

export const getChatDraft = (conversationId: string) => drafts.get(conversationId) ?? '';

export function setChatDraft(conversationId: string, text: string) {
  if (text.trim()) drafts.set(conversationId, text);
  else drafts.delete(conversationId);
}
