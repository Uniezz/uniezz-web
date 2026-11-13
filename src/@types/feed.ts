import type { components, operations } from './schema';

export type FeedPost = components['schemas']['Post'];
export type FeedComment = components['schemas']['Comment'];
export type FeedFilters = Omit<NonNullable<operations['listFeedPosts']['parameters']['query']>, 'cursor'>;

export type FeedPostsPage = components['schemas']['ListPostsOutputBody'];
export type PostNavigation = components['schemas']['PostNavigation'];
export type FeedPostSearch = { postFilters?: FeedFilters; postSource?: FeedPostSource };
export type FeedPostCardProps = { post: FeedPost; filters?: FeedFilters; source?: FeedPostSource };

export type UploadedPostImage = { file: File; mediaId: string };

export type FeedPostSource = 'posts' | 'liked' | 'saved';
export type UploadPostImagesInput = { files: File[]; uploaded: UploadedPostImage[] };

export type CreateFeedPostInput = components['schemas']['CreatePostInputBody'];
export type UpdateFeedPostInput = components['schemas']['UpdatePostInputBody'];
export type UpdateFeedPostRequest = { id: string; body: UpdateFeedPostInput };
export type FeedPostSubmission = { body: CreateFeedPostInput; key: string };
export type FeedAuthorName = Pick<components['schemas']['Author'], 'firstName' | 'lastName'>;
export type PostDateInput = Pick<FeedPost, 'eventDate' | 'createdAt'>;
export type DatePreset = 'today' | 'week' | 'month' | 'year';
export type FeedFilterValues = FeedFilters & { date?: DatePreset };
export type FeedFilterBarProps = { filters: FeedFilterValues; onChange: (filters: FeedFilterValues) => void };
