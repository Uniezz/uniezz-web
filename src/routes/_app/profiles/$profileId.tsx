import { createFileRoute, Link, useCanGoBack, useRouter } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import { usePublicProfile } from '@/hooks';
import { UIQueryError } from '@/ui/components';
import { PublicProfile } from '@/components/features/profile/PublicProfile';
import { samplePublicProfile } from '@/utils/profileSkeletonData';
import { optionalSearchStringSchema } from '@/schemas';

export const Route = createFileRoute('/_app/profiles/$profileId')({
  validateSearch: (search: Record<string, unknown>) => ({
    studentSearch: optionalSearchStringSchema.parse(search.studentSearch),
  }),
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { profileId } = Route.useParams();
  const { t } = useTranslation();
  const { data: profile, isPending, isError, refetch } = usePublicProfile(profileId);
  if (isError) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <ProfileBack />
        <UIQueryError retry={() => void refetch()} />
      </div>
    );
  }
  return (
    <Skeleton loading={isPending} label={t('apiState.loading')}>
      <div className="mx-auto max-w-5xl space-y-5">
        <ProfileBack />
        <PublicProfile profile={profile ?? samplePublicProfile} />
      </div>
    </Skeleton>
  );
}

function ProfileBack() {
  const { t } = useTranslation();
  const { studentSearch } = Route.useSearch();
  const canGoBack = useCanGoBack();
  const router = useRouter();
  const className =
    'inline-flex min-h-11 cursor-pointer items-center gap-2 text-label text-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-blue';
  const content = (
    <>
      <ChevronLeft className="size-5" aria-hidden="true" />
      {t('app.back')}
    </>
  );

  return canGoBack ? (
    <button type="button" onClick={() => router.history.back()} className={className}>
      {content}
    </button>
  ) : (
    <Link to="/students" search={{ studentSearch }} className={className}>
      {content}
    </Link>
  );
}
