import type { components } from './schema';

type Schemas = components['schemas'];

/** API chat types. They replace the mock types below in the route migration (W1.5a). */
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

export type MessageAttachment = {
  name: string;
  url: string;
  size: number;
  contentType: string;
  /** Only images have one for now; files stay local until the backend accepts them. */
  mediaId?: string;
};
export type Message = { text: string; outgoing: boolean; time: string; attachments?: MessageAttachment[] };
export type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  group: boolean;
  unread: number;
  image: number;
  imageUrl?: string;
  messages: Message[];
};

