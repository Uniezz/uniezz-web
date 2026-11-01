import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { components } from '@/@types/schema';
import { UIAvatar, UIUniversityLogo } from '@/ui/components';
import { authorName } from '@/utils/feed';

export function StudentCard({
  student,
  search,
  university,
}: {
  student: components['schemas']['ProfileSummary'];
  search: string;
  university?: string;
}) {
  const { t } = useTranslation();
  return (
    <Link
      to="/profiles/$profileId"
      params={{ profileId: student.id }}
      search={{ studentSearch: search }}
      className="group flex min-h-22 items-center gap-4 px-4 py-4 transition-colors hover:bg-white-5 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-blue sm:px-6"
    >
      <UIAvatar
        size="lg"
        imgSrc={student.avatarUrl ?? '/app/avatar.png'}
        alt=""
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-body font-semibold wrap-anywhere text-white">
          {authorName(student) || t('apiState.student')}
        </h3>
        <p className="mt-1 text-detail leading-relaxed wrap-anywhere text-secondary">
          {university ?? student.universityId.toUpperCase()}
        </p>
      </div>
      {university && (
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white-10 bg-white-5 py-1 pr-2 pl-1 text-micro font-semibold tracking-wide text-secondary sm:flex">
          <UIUniversityLogo universityId={student.universityId} />
          {/* Trims the text box to the capitals, so they centre optically next to the logo. */}
          <span className="[text-box:trim-both_cap_alphabetic]">
            {student.universityId.toUpperCase()}
          </span>
        </span>
      )}
      <ChevronRight
        className="size-5 shrink-0 text-secondary transition-colors group-hover:text-white"
        aria-hidden="true"
      />
    </Link>
  );
}
