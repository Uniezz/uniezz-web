import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { StudentSummary } from '@/@types';
import { useMyProfile, useUniversities } from '@/hooks';
import { UIAvatar, UIUniversityLogo } from '@/ui/components';
import { authorName } from '@/utils';

/** Phone-only: the mobile app's StudentRow, one glass card that opens the student (or your own profile). */
export function StudentRow({ student }: { student: StudentSummary }) {
  const { t } = useTranslation();
  const { data: me } = useMyProfile();
  const { data: universities = [] } = useUniversities();
  const name = authorName(student) || t('apiState.student');
  const university =
    universities.find(({ id }) => id === student.universityId)?.name ??
    student.universityId.toUpperCase();
  const className =
    'glass flex items-center gap-3 rounded-xl p-3 focus-visible:outline-2 focus-visible:outline-blue active:opacity-80';
  const content = (
    <>
      <UIAvatar
        imgSrc={student.avatarUrl ?? '/app/avatar.png'}
        alt=""
        className="shrink-0 [&>div]:size-10 [&>div]:border-0"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-body font-semibold">{name}</span>
        <span className="flex min-w-0 items-center gap-1.5">
          <UIUniversityLogo universityId={student.universityId} size="xs" />
          <span className="truncate text-detail text-secondary">{university}</span>
        </span>
      </span>
      <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-white-40" />
    </>
  );
  return student.id === me?.id ? (
    <Link
      to="/profile"
      aria-label={name}
      data-ph-capture-attribute-label="Open own profile"
      className={className}
    >
      {content}
    </Link>
  ) : (
    <Link
      to="/connections/students/$profileId"
      params={{ profileId: student.id }}
      search={{ studentSearch: undefined }}
      aria-label={name}
      data-ph-capture-attribute-label="Open student profile"
      className={className}
    >
      {content}
    </Link>
  );
}

/** The mobile app's glass skeleton rows for a student list. */
export function StudentRowSkeletons({ count }: { count: number }) {
  const { t } = useTranslation();
  return (
    <div role="status" aria-label={t('apiState.loading')} className="flex flex-col gap-2.5">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex items-center gap-3 rounded-xl p-3 glass"
        >
          <span className="size-10 shrink-0 animate-pulse rounded-full bg-white-10" />
          <span className="flex flex-1 flex-col gap-2">
            <span className="h-3.5 w-1/2 animate-pulse rounded-full bg-white-10" />
            <span className="h-3 w-2/3 animate-pulse rounded-full bg-white-10" />
          </span>
        </div>
      ))}
    </div>
  );
}
