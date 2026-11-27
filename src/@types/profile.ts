import type { components } from './schema';
export type Programme = components['schemas']['Programme'];

export type Profile = components['schemas']['Profile'];
export type UpdateMeBody = components['schemas']['UpdateMeBody'];
export type ProfileLanguage = NonNullable<UpdateMeBody['language']>;
export type PublicProfile = components['schemas']['PublicProfile'];
export type PublicProfileProps = { profile: PublicProfile };
export type FollowList = 'followers' | 'following';
export type ProfilePostsProps = { authorId: string; collections?: boolean };
