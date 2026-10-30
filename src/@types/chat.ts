export type Message = { text: string; outgoing: boolean; time: string };
export type Conversation = {
  name: string;
  preview: string;
  time: string;
  group: boolean;
  unread: number;
  image: number;
  imageUrl?: string;
  messages: Message[];
};

export type ChatView = { selected: string; panel: 'list' | 'thread' | 'group' };
