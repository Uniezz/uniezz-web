import { useNavigate } from '@tanstack/react-router';
import { ShieldPlus } from 'lucide-react';
import { BlockStudentButton } from '@/components/features/connections';
import { useTranslation } from 'react-i18next';
import type { PublicProfileProps } from '@/@types';
import { useMyProfile, useUniversities } from '@/hooks';
import { UIPanel, UITags, UIUniversityLogo } from '@/ui/components';
import { ReportButton } from '@/components/features/reports';
import { BanButton, GrantModeratorButton } from '@/components/features/moderation';
import { authorName, isAdmin, isStaff } from '@/utils';
import { cn } from '@/ui/cn';

export function PublicProfile({ profile }: PublicProfileProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: me } = useMyProfile();
  const { data: universities } = useUniversities();
  const university =
    universities?.find((item) => item.id === profile.universityId)?.name ??
    profile.universityId.toUpperCase();
  const isMe = me?.id === profile.id;
  // Avatar first; the avatar alone adds nothing.
  const photos = profile.photos && profile.photos.length > 1 ? profile.photos : [];
  const hasPersonalDetails = Boolean(
    profile.bio || profile.interests?.length || profile.songUrl || photos.length,
  );
  const hasStudyDetails = Boolean(profile.programmes?.length);

  return (
    <UIPanel className="profile-page overflow-hidden p-2">
      <div className="profile-cover relative h-40 overflow-hidden rounded-2xl sm:h-52">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <>
            <div className="profile-cover-orbit" />
            <div className="profile-cover-glass pointer-events-none absolute inset-0 rounded-2xl border border-white-10 bg-white-5 backdrop-blur-sm" />
          </>
        )}
        <img
          src="/favicon.png"
          alt=""
          aria-hidden="true"
          className="absolute top-3 right-3 size-12 rounded-xl object-contain sm:top-4 sm:right-4"
        />
        {me && !isMe && (
          <div className="absolute right-2 bottom-2 z-10 flex flex-col items-end gap-2 rounded-xl border border-white-10 bg-surface/75 px-3 py-2 backdrop-blur-md sm:right-3 sm:bottom-3">
            <ReportButton targetType="user" targetId={profile.id} danger />
            {isStaff(me) && <BanButton userId={profile.id} inline />}
            {isAdmin(me) && <GrantModeratorButton userId={profile.id} icon={ShieldPlus} inline />}
            <BlockStudentButton
              studentId={profile.id}
              onBlocked={() =>
                void navigate({
                  to: '/connections/students',
                  search: { studentSearch: undefined },
                })
              }
            />
          </div>
        )}
      </div>
      <div className="px-4 pb-6 sm:px-8 sm:pb-8">
        <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-end gap-x-5 sm:gap-x-6">
          <div className="-mt-10 self-start rounded-full sm:row-span-2 sm:-mt-12">
            <img
              src={profile.avatarUrl ?? '/app/avatar.png'}
              alt=""
              className="size-24 rounded-full bg-surface object-cover sm:size-32"
            />
          </div>
          <div className="col-span-2 mt-4 min-w-0 space-y-3 sm:col-span-1 sm:col-start-2 sm:row-start-2 sm:mt-2">
            <h1
              title={authorName(profile) || undefined}
              className="line-clamp-2 text-xxl leading-tight font-semibold tracking-tight wrap-anywhere sm:text-4xl"
            >
              {authorName(profile) || t('apiState.student')}
              {profile.age !== null && (
                <span className="font-normal text-secondary">, {profile.age}</span>
              )}
            </h1>
            <p className="flex items-center gap-2 text-label leading-relaxed text-white-80">
              <UIUniversityLogo universityId={profile.universityId} className="shrink-0" />
              <span className="min-w-0 wrap-anywhere">{university}</span>
            </p>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-block max-w-full rounded-sm text-detail wrap-anywhere text-secondary hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-sky"
              >
                {profile.email}
              </a>
            )}
          </div>
        </div>

        {(hasPersonalDetails || hasStudyDetails) && (
          <div
            className={cn(
              'mt-8 grid gap-8 border-t border-white-10 pt-8',
              hasPersonalDetails &&
                hasStudyDetails &&
                'md:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)]',
            )}
          >
            {hasPersonalDetails && (
              <div className="min-w-0 space-y-8">
                {photos.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-label font-semibold">{t('students.photosTitle')}</h2>
                    <ul className="scrollbar-hidden flex gap-3 overflow-x-auto">
                      {photos.map((url) => (
                        <li key={url} className="shrink-0">
                          <img src={url} alt="" className="size-48 rounded-2xl object-cover" />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {profile.bio && (
                  <section className="space-y-4">
                    <h2 className="text-label font-semibold">{t('students.bio')}</h2>
                    <p className="max-w-prose text-body leading-relaxed wrap-anywhere whitespace-pre-wrap text-white-80">
                      {profile.bio}
                    </p>
                  </section>
                )}
                {profile.interests && profile.interests.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-label font-semibold">{t('students.interests')}</h2>
                    <UITags tags={profile.interests} label={t('students.interests')} />
                  </section>
                )}
                {profile.songUrl && (
                  <section className="space-y-4">
                    <h2 className="text-label font-semibold">{t('students.song')}</h2>
                    <a
                      href={profile.songUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ph-capture-attribute-label="Open song"
                      className="inline-block max-w-full truncate rounded-sm text-detail text-secondary hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-blue"
                    >
                      {profile.songUrl}
                    </a>
                  </section>
                )}
              </div>
            )}
            {hasStudyDetails && (
              <div
                className={cn(
                  'min-w-0 space-y-8',
                  hasPersonalDetails &&
                    'border-t border-white-10 pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8',
                )}
              >
                {profile.programmes && profile.programmes.length > 0 && (
                  <section className="space-y-5">
                    <h2 className="text-label font-semibold">{t('app.studyProgrammes')}</h2>
                    <ul className="max-h-120 divide-y divide-white-10 overflow-y-auto pr-2">
                      {profile.programmes.map((programme, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                        >
                          <UIUniversityLogo
                            universityId={profile.universityId}
                            size="md"
                            className="mt-1"
                          />
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <h3 className="text-md leading-snug font-medium wrap-anywhere">
                              {programme.programme}
                            </h3>
                            <div className="space-y-2 text-detail leading-relaxed text-secondary">
                              {programme.faculty &&
                                programme.faculty.trim() !== programme.programme.trim() && (
                                  <p className="wrap-anywhere">{programme.faculty}</p>
                                )}
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {programme.yearOfStudy != null && (
                                  <span>{t('app.studyYear', { year: programme.yearOfStudy })}</span>
                                )}
                                {programme.isPrimary && (profile.programmes?.length ?? 0) > 1 && (
                                  <span className="text-white-80">{t('app.primary')}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </UIPanel>
  );
}
