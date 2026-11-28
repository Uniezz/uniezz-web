import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { FeedPost } from '@/@types';
import { cn } from '@/ui/cn';
import { UIAvatar, UIUniversityLogo } from '@/ui/components';
import { authorName } from '@/utils';

/** The mobile app's author line: avatar, name, university logo and date, all opening the profile. */
export function AuthorRow({
  author,
  meta,
  disabled = false,
  className,
}: {
  author: FeedPost['author'];
  meta: string;
  /** Already on the author's profile: a link would only loop back. */
  disabled?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const href = useLocation({ select: (location) => location.href });
  const name = authorName(author) || t('apiState.student');
  const content = (
    <>
      <UIAvatar size="mobileSm" imgSrc={author.avatarUrl ?? '/app/avatar.png'} alt="" />
      {/* the name gives way first, so the university and date stay visible */}
      <span className="min-w-0 truncate text-detail font-medium text-white">{name}</span>
      <UIUniversityLogo universityId={author.universityId} size="xs" />
      {meta && <span className="shrink-0 text-detail text-secondary">· {meta}</span>}
    </>
  );
  const rowClass = cn('relative z-20 flex min-w-0 items-center gap-2', className);

  if (disabled) return <div className={rowClass}>{content}</div>;
  return (
    <Link
      to="/connections/students/$profileId"
      params={{ profileId: author.id }}
      search={{ studentSearch: undefined, from: href }}
      aria-label={name}
      data-ph-capture-attribute-label="Open post author profile"
      className={cn(
        rowClass,
        'w-fit max-w-full rounded-sm focus-visible:outline-2 focus-visible:outline-blue active:opacity-80',
      )}
    >
      {content}
    </Link>
  );
}
