import type { components } from './schema';

type Schemas = components['schemas'];

/** Chat types from the API. */
export type ChatStudent = Schemas['Student'];
export type ChatAttachment = Schemas['Attachment'];
export type ChatConversation = Schemas['Conversation'];
export type ChatMember = Schemas['Member'];
export type ChatMessage = Schemas['Message'];
export type ChatMessageKind = ChatMessage['kind'];
export type ChatConversationKind = ChatConversation['kind'];

/** One page of a chat list. `nextCursor` is null on the last page. */
export type ChatPage<T> = { items: T[] | null; nextCursor: string | null };

/** A message as the UI holds it. `sending` exists only on the client, before the server answers. */
export type ChatMessageView = ChatMessage & { status?: 'sending' };
