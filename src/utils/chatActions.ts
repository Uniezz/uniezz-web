import type { ChatMessageView } from '@/@types';

export type ChatMessageAction = 'copy' | 'report' | 'delete';

/** What the student can do with a message. A message that is still sending, or deleted, has no actions. */
export function messageActions(
  { status, deletedAt, body, sender }: ChatMessageView,
  outgoing: boolean,
): ChatMessageAction[] {
  if (status === 'sending' || deletedAt) return [];
  const actions: ChatMessageAction[] = [];
  if (body) actions.push('copy');
  if (outgoing) actions.push('delete');
  // The server does not take reports about deleted accounts.
  else if (sender.id !== null && !sender.deleted) actions.push('report');
  return actions;
}
