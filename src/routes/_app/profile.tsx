import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';

import { myProfileQueryOptions } from '@/hooks/useMyProfile';
import { UIQueryError } from '@/ui/components';
import { ProfileEditor } from '@/components/features/profile/ProfileEditor';
import { sampleProfile } from '@/utils/profileSkeletonData';

export const Route = createFileRoute('/_app/profile')({
  loader: ({ context }) => context.queryClient.ensureQueryData(myProfileQueryOptions()),
  pendingComponent: ProfileSkeleton,
  errorComponent: ProfileError,
  component: ProfilePage,
});

function ProfileSkeleton() {
  const { t } = useTranslation();
  return (
    <Skeleton loading label={t('apiState.loading')}>
      <div inert>
        <ProfileEditor profile={sampleProfile} />
      </div>
    </Skeleton>
  );
}

function ProfileError() {
  const router = useRouter();
  return <UIQueryError retry={() => void router.invalidate()} />;
}

function ProfilePage() {
  const profile = Route.useLoaderData();
  return <ProfileEditor key={profile.id} profile={profile} />;
}
