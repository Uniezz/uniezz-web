export type MessageAttachment = { name: string; url: string; mediaId: string };
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

