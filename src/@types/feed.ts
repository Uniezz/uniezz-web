import type { components, operations } from './schema';

export type FeedPost = components['schemas']['Post'];
export type FeedComment = components['schemas']['Comment'];
export type FeedFilters = Omit<NonNullable<operations['listFeedPosts']['parameters']['query']>, 'cursor'>;
