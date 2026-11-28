import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { StudentCardProps } from '@/@types';
import { UIAvatar, UIUniversityLogo } from '@/ui/components';
import { authorName } from '@/utils';

export function StudentCard({ student, search, university, action }: StudentCardProps) {
  const { t } = useTranslation();
  const href = useLocation({ select: (location) => location.href });
  const card = (
    <Link
      to="/connections/students/$profileId"
      params={{ profileId: student.id }}
      data-ph-capture-attribute-label="Open student profile"
      search={{ studentSearch: search, from: href }}
      className="group flex min-h-22 items-center gap-4 px-4 py-4 transition-colors hover:bg-white-5 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-blue max-lg:min-h-0 max-lg:gap-3 max-lg:p-3 sm:px-6"
    >
      <UIAvatar
        size="lg"
        imgSrc={student.avatarUrl ?? '/app/avatar.png'}
        alt=""
        className="shrink-0 max-lg:size-10"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-body font-semibold wrap-anywhere text-white max-lg:truncate">
          {authorName(student) || t('apiState.student')}
        </h3>
        <p className="mt-1 text-detail leading-relaxed wrap-anywhere text-secondary max-lg:hidden">
          {university ?? student.universityId.toUpperCase()}
        </p>
        {/* On a phone, the app's logo and short code instead of the full university name. */}
        <p className="mt-1 flex items-center gap-1.5 text-detail text-secondary lg:hidden">
          <UIUniversityLogo universityId={student.universityId} />
          {student.universityId.toUpperCase()}
        </p>
      </div>
      {university && (
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white-10 bg-white-5 py-1 pr-2 pl-1 text-micro font-semibold tracking-wide text-secondary lg:flex">
          <UIUniversityLogo universityId={student.universityId} />
          {/* Trims the text box to the capitals, so they centre optically next to the logo. */}
          <span className="[text-box:trim-both_cap_alphabetic]">
            {student.universityId.toUpperCase()}
          </span>
        </span>
      )}
      <ChevronRight
        className="size-5 shrink-0 text-secondary transition-colors group-hover:text-white max-lg:size-4"
        aria-hidden="true"
      />
    </Link>
  );
  // A button can't sit inside a link, so the action goes beside it and the whole row highlights.
  if (!action) return card;
  return (
    <div className="flex items-center pr-2 transition-colors hover:bg-white-5 sm:pr-4 [&>a]:min-w-0 [&>a]:flex-1 [&>a]:hover:bg-transparent">
      {card}
      {action}
    </div>
  );
}
