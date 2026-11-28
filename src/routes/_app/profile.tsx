import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';

import { myProfileQueryOptions, useMyProfile, usePhoneViewport } from '@/hooks';
import { UIQueryError } from '@/ui/components';
import {
  OwnProfilePhone,
  ProfileEditor,
  ProfilePhoneError,
  ProfilePhoneSkeleton,
} from '@/components/features/profile';
import { sampleProfile } from '@/utils';

export const Route = createFileRoute('/_app/profile')({
  loader: ({ context }) => context.queryClient.ensureQueryData(myProfileQueryOptions()),
  pendingComponent: ProfileSkeleton,
  errorComponent: ProfileError,
  component: ProfilePage,
});

function ProfileSkeleton() {
  const { t } = useTranslation();
  // on a phone, the mobile app's header over its hero skeleton
  const isPhone = usePhoneViewport();
  if (isPhone) return <ProfilePhoneSkeleton />;
  return (
    <Skeleton loading label={t('apiState.loading')}>
      <div inert>
        <ProfileEditor profile={sampleProfile} showPosts={false} />
      </div>
    </Skeleton>
  );
}

function ProfileError() {
  const router = useRouter();
  const isPhone = usePhoneViewport();
  const handleRetry = () => void router.invalidate();
  return isPhone ? <ProfilePhoneError retry={handleRetry} /> : <UIQueryError retry={handleRetry} />;
}

function ProfilePage() {
  const loaded = Route.useLoaderData();
  // the phone screen saves its sheets and photos straight to the cache, so it follows the query
  const { data: profile = loaded } = useMyProfile();
  const isPhone = usePhoneViewport();
  return isPhone ? <OwnProfilePhone profile={profile} /> : <ProfileEditor profile={loaded} />;
}
