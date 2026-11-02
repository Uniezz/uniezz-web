import type { FeedComment, FeedPost } from '@/@types';

export const samplePost: FeedPost = {
  id: 'skeleton',
  type: 'announcement',
  title: 'Student community announcement',
  content: '',
  university: 'umcs',
  author: {
    id: 'skeleton',
    firstName: 'Student',
    lastName: 'Name',
    avatarUrl: null,
    universityId: 'umcs',
  },
  mediaUrls: ['/app/avatar.png'],
  createdAt: '2026-01-01T12:00:00Z',
  eventDate: null,
  editedAt: null,
  tags: null,
  commentsCount: 0,
  likesCount: 0,
  likedByMe: false,
};

export const sampleComment: FeedComment = {
  id: 'skeleton',
  postId: 'skeleton',
  parentId: null,
  replyToCommentId: null,
  author: samplePost.author,
  content: 'A comment from another student.',
  createdAt: samplePost.createdAt,
  editedAt: null,
  deleted: false,
  likedByMe: false,
  likesCount: 0,
  repliesCount: 0,
};
