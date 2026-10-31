export type FeedPostType = 'post' | 'question' | 'event';

export type FeedComment = {
  id: string;
  author: string;
  text: string;
  avatar?: string;
};

export type FeedPost = {
  id: string;
  type: FeedPostType;
  title: string;
  author: string;
  university: string;
  summary: string;
  body?: string;
  image?: string;
  avatar?: string;
  time?: string;
  category?: string;
  location?: string;
  eventDate?: string;
  comments: FeedComment[];
};
