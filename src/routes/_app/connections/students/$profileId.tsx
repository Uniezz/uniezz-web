import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import { usePublicProfile } from '@/hooks';
import { UIQueryError } from '@/ui/components';
import { PublicProfile } from '@/components/features/profile/PublicProfile';
import { ProfilePosts } from '@/components/features/profile/ProfilePosts';
import { ProfileStickyBar } from '@/components/features/profile/ProfileStickyBar';
import { samplePublicProfile } from '@/utils/profileSkeletonData';
import { optionalSearchStringSchema, returnPathSchema } from '@/schemas';

export const Route = createFileRoute('/_app/connections/students/$profileId')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { studentSearch: string | undefined; from?: string } => {
    // `from`: the screen that opened this profile (a post, the student list), for Back.
    const from = returnPathSchema.parse(search.from);
    return {
      studentSearch: optionalSearchStringSchema.parse(search.studentSearch),
      ...(from ? { from } : {}),
    };
  },
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { profileId } = Route.useParams();
  const { t } = useTranslation();
  const { data: profile, isPending, isError, refetch } = usePublicProfile(profileId);
  // The bar shows once the card has left the viewport through the top, not the bottom.
  const { ref: card, entry } = useInView();
  const cardAbove = entry ? !entry.isIntersecting && entry.boundingClientRect.top < 0 : false;
  if (isError) {
    return (
      <div className="relative mx-auto max-w-5xl space-y-5">
        <ProfileBack />
        <UIQueryError retry={refetch} />
      </div>
    );
  }
  return (
    <Skeleton loading={isPending} label={t('apiState.loading')}>
      <div className="relative mx-auto max-w-5xl space-y-5">
        {profile && <ProfileStickyBar profile={profile} shown={cardAbove} />}
        <ProfileBack />
        <div ref={card} inert={isPending}>
          <PublicProfile profile={profile ?? samplePublicProfile} />
        </div>
        {profile && <ProfilePosts authorId={profile.id} />}
      </div>
    </Skeleton>
  );
}

function ProfileBack() {
  const { t } = useTranslation();
  const { studentSearch, from } = Route.useSearch();
  const router = useRouter();
  const list = studentSearch
    ? `/connections/students?${new URLSearchParams({ studentSearch })}`
    : '/connections/students';
  return (
    <button
      type="button"
      onClick={() => router.history.push(from ?? list)}
      data-ph-capture-attribute-label={t('app.back')}
      className="inline-flex min-h-11 items-center gap-2 px-2 py-2 text-label text-secondary transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-blue xl:absolute xl:top-0 xl:-left-32"
    >
      <ChevronLeft className="size-5" aria-hidden="true" />
      {t('app.back')}
    </button>
  );
}
