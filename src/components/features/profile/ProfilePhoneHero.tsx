import { Camera, Music } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { PublicProfile } from '@/@types';
import type { components } from '@/@types/schema';
import { useUniversities } from '@/hooks';
import { UIUniversityLogo } from '@/ui/components';
import { authorName } from '@/utils';
import { PhotoViewer } from './PhotoViewer';
import { ProfileFollows } from './ProfileFollows';

export type ProfilePhoneHeroProps = {
  profile: components['schemas']['Profile'] | PublicProfile;
  isUploadingPhoto?: boolean;
  /** The own profile: the avatar changes the photo. Without it, a tap opens the photo full screen. */
  onChangePhoto?: (file: File) => void;
  /** A student's profile: the follow button beside the counts. */
  followAction?: ReactNode;
  /** A student's profile: a line under the counts, such as their gender. */
  detail?: string;
};

/** The mobile app's ProfileHero: the identity card, then follows, bio and interests under it. */
export function ProfilePhoneHero({
  profile,
  isUploadingPhoto = false,
  onChangePhoto,
  followAction,
  detail,
}: ProfilePhoneHeroProps) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const handleAvatarOpen = () => setViewerIndex(0);
  const handleViewerClose = () => setViewerIndex(null);
  const avatar = (
    <img
      src={profile.avatarUrl ?? '/app/avatar.png'}
      alt=""
      className="size-28 rounded-full object-cover"
    />
  );
  const universityName =
    universities.find(({ id }) => id === profile.universityId)?.name ??
    profile.universityId.toUpperCase();
  const songHost = profile.songUrl ? safeHost(profile.songUrl) : '';
  return (
    <div className="flex flex-col gap-5">
      <div className="relative isolate flex flex-col gap-2 overflow-hidden rounded-card border border-white-20 bg-white-3 p-1.5 backdrop-blur-xl">
        {profile.bannerUrl && (
          <img
            src={profile.bannerUrl}
            alt=""
            className="absolute inset-0 -z-10 size-full scale-110 object-cover blur-xl"
          />
        )}
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-sky/15 bg-sky/5 px-5 py-6 text-center">
          {onChangePhoto ? (
            <label
              data-ph-capture-attribute-label={t('app.changePhoto')}
              className={
                isUploadingPhoto
                  ? 'relative cursor-not-allowed opacity-60'
                  : 'relative cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue'
              }
            >
              {avatar}
              <span className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-2xl glass">
                <Camera size={15} aria-hidden="true" />
              </span>
              <input
                type="file"
                aria-label={t('app.changePhoto')}
                disabled={isUploadingPhoto}
                className="sr-only"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) onChangePhoto(file);
                }}
              />
            </label>
          ) : profile.avatarUrl ? (
            <button
              type="button"
              aria-label={t('app.openImage')}
              data-ph-capture-attribute-label="Open profile photo"
              onClick={handleAvatarOpen}
              className="rounded-full focus-visible:outline-2 focus-visible:outline-blue"
            >
              {avatar}
            </button>
          ) : (
            avatar
          )}
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-[34px] leading-[1.1] font-semibold tracking-[-1.2px] wrap-anywhere">
              {authorName(profile) || t('apiState.student')}
            </h2>
            {profile.email && (
              <p className="text-label font-medium wrap-anywhere text-white-80">{profile.email}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-sky/15 bg-sky/5 px-3 py-4">
          <UIUniversityLogo universityId={profile.universityId} size="xs" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-micro font-medium text-secondary">{t('app.university')}</span>
            <span className="text-label font-semibold wrap-anywhere">{universityName}</span>
          </div>
        </div>
        {profile.songUrl && (
          <a
            href={profile.songUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t('students.song')}
            data-ph-capture-attribute-label="Open profile song"
            className="flex min-w-0 items-center gap-1.5 px-2.5 py-2"
          >
            <Music size={14} aria-hidden="true" className="shrink-0 text-white-60" />
            <span className="truncate text-detail text-sky">{songHost}</span>
          </a>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <ProfileFollows
          inline
          profileId={followAction ? profile.id : undefined}
          name={followAction ? authorName(profile) : t('app.yourProfile')}
          followersCount={profile.followersCount}
          followingCount={profile.followingCount}
        />
        {followAction}
      </div>
      {detail && <p className="text-detail text-secondary">{detail}</p>}
      {profile.bio && (
        <p className="text-base leading-6 wrap-anywhere whitespace-pre-wrap text-white-80">
          {profile.bio}
        </p>
      )}
      {profile.interests && profile.interests.length > 0 && (
        <ul aria-label={t('students.interests')} className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <li
              key={interest}
              className="rounded-full border border-white-10 bg-white-5 px-2.75 py-1.25 text-detail font-medium text-white-80"
            >
              {interest}
            </li>
          ))}
        </ul>
      )}
      {profile.avatarUrl && (
        <PhotoViewer urls={[profile.avatarUrl]} index={viewerIndex} onClose={handleViewerClose} />
      )}
    </div>
  );
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
