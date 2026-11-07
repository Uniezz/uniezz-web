import { createFileRoute, Link, useCanGoBack, useRouter } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import { usePublicProfile } from '@/hooks';
import { UIQueryError } from '@/ui/components';
import { PublicProfile } from '@/components/features/profile/PublicProfile';
import { samplePublicProfile } from '@/utils/profileSkeletonData';
import { optionalSearchStringSchema } from '@/schemas';

export const Route = createFileRoute('/_app/connections/students/$profileId')({
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
      <div className="relative mx-auto max-w-5xl space-y-5">
        <ProfileBack />
        <UIQueryError retry={refetch} />
      </div>
    );
  }
  return (
    <Skeleton loading={isPending} label={t('apiState.loading')}>
      <div className="relative mx-auto max-w-5xl space-y-5">
        <ProfileBack />
        <div inert={isPending}>
          <PublicProfile profile={profile ?? samplePublicProfile} />
        </div>
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
    'inline-flex min-h-11 items-center gap-2 px-2 py-2 text-label text-secondary transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-blue xl:absolute xl:top-0 xl:-left-32';
  const content = (
    <>
      <ChevronLeft className="size-5" aria-hidden="true" />
      {t('app.back')}
    </>
  );

  return canGoBack ? (
    <button
      type="button"
      onClick={() => router.history.back()}
      data-ph-capture-attribute-label={t('app.back')}
      className={className}
    >
      {content}
    </button>
  ) : (
    <Link
      to="/connections/students"
      search={{ studentSearch }}
      data-ph-capture-attribute-label={t('app.back')}
      className={className}
    >
      {content}
    </Link>
  );
}
