import type { FeedPostsPage, PostNavigation, UploadedPostImage, FeedPost } from '@/@types';
import type {
  CreateFeedPostInput,
  FeedPostSubmission,
  FeedAuthorName,
  PostDateInput,
  DatePreset,
} from '@/@types';
import type { PostSchema } from '@/schemas';

export async function uploadPostImages(
  files: File[],
  previous: UploadedPostImage[],
  upload: (file: File) => Promise<UploadedPostImage>,
) {
  const uploaded = previous.filter((item) => files.includes(item.file));
  const mediaIds: string[] = [];
  try {
    for (const file of files) {
      let image = uploaded.find((item) => item.file === file);
      if (!image) {
        image = await upload(file);
        uploaded.push(image);
      }
      mediaIds.push(image.mediaId);
    }
    return { uploaded, mediaIds, failed: false as const };
  } catch (error) {
    return { uploaded, failed: true as const, error };
  }
}

export function postFormDefaults(
  post: Pick<FeedPost, 'eventDate' | 'type' | 'university' | 'title' | 'content' | 'tags'>,
): PostSchema {
  const date = post.eventDate ? new Date(post.eventDate) : null;
  const local =
    date && !Number.isNaN(date.getTime())
      ? new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
      : '';
  const [day = '', time = ''] = local.split('T');
  return {
    type: post.type,
    audience: post.university === 'all' ? 'all' : 'university',
    title: post.title,
    body: post.content,
    tags: post.tags ?? [],
    tagDraft: '',
    images: [],
    date: day,
    time,
  };
}

export function authorName(author?: FeedAuthorName) {
  return [author?.firstName, author?.lastName].filter(Boolean).join(' ');
}

export function postDate(post: PostDateInput, locale: string) {
  const date = new Date(post.eventDate ?? post.createdAt);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
}

export function postSubmission(body: CreateFeedPostInput, previous?: FeedPostSubmission) {
  return previous && JSON.stringify(previous.body) === JSON.stringify(body)
    ? previous
    : { body, key: crypto.randomUUID() };
}

const DAY = 24 * 60 * 60 * 1000;
const DATE_PRESET_DAYS = { today: 1, week: 7, month: 30, year: 365 } as const satisfies Record<
  DatePreset,
  number
>;

/** Rolling window ending now: the last 24 hours, 7, 30 or 365 days. */
export function datePresetFrom(preset: DatePreset, now = new Date()) {
  return new Date(now.getTime() - DATE_PRESET_DAYS[preset] * DAY).toISOString();
}

/** Whether `path` (pathname, optionally with a query) is this author's profile, so linking to it again would only loop back. */
export function isAuthorProfilePath(path: string | undefined, authorId: string, myId?: string) {
  const pathname = path?.split('?')[0];
  return (
    pathname === `/connections/students/${authorId}` ||
    (pathname === '/profile' && authorId === myId)
  );
}

export function feedPostNeighbours(id: string, pages: FeedPostsPage[] | undefined): PostNavigation {
  const ids = pages?.flatMap((page) => page.items?.map((post) => post.id) ?? []) ?? [];
  const index = ids.indexOf(id);
  return {
    previousId: index > 0 ? (ids[index - 1] ?? null) : null,
    nextId: index >= 0 ? (ids[index + 1] ?? null) : null,
  };
}
