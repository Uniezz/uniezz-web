import { useNavigate } from '@tanstack/react-router';
import { BlockStudentButton } from '@/components/features/connections/BlockStudentButton';
import { Heart, Music2, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { components } from '@/@types/schema';
import { useMyProfile, useUniversities } from '@/hooks';
import { UIPanel, UIUniversityLogo } from '@/ui/components';
import { ReportButton } from '@/components/features/reports/ReportButton';
import { authorName } from '@/utils/feed';
import { cn } from '@/ui/cn';

export function PublicProfile({ profile }: { profile: components['schemas']['PublicProfile'] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: me } = useMyProfile();
  const { data: universities } = useUniversities();
  const university =
    universities?.find((item) => item.id === profile.universityId)?.name ??
    profile.universityId.toUpperCase();
  const hasPersonalDetails = Boolean(profile.bio || profile.interests?.length || profile.songUrl);
  const hasStudyDetails = Boolean(profile.programmes?.length);

  return (
    <UIPanel className="profile-page overflow-hidden p-2">
      <div
        className="profile-cover relative h-40 overflow-hidden rounded-2xl sm:h-52"
        aria-hidden="true"
      >
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <>
            <div className="profile-cover-orbit" />
            <div className="profile-cover-glass pointer-events-none absolute inset-0 rounded-2xl border border-white-10 bg-white-5 backdrop-blur-sm" />
            <img
              src="/favicon.png"
              alt=""
              className="absolute right-5 bottom-5 size-12 rounded-xl object-contain sm:right-8"
            />
          </>
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
            <h1 className="text-xxl leading-tight font-semibold tracking-tight wrap-anywhere sm:text-4xl">
              {authorName(profile) || t('apiState.student')}
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
                {profile.bio && (
                  <section className="space-y-4">
                    <h2 className="flex items-center gap-3 text-label font-semibold">
                      <UserRound className="size-4.5 text-sky" aria-hidden="true" />
                      {t('students.bio')}
                    </h2>
                    <p className="max-w-prose text-body leading-relaxed wrap-anywhere whitespace-pre-wrap text-white-80">
                      {profile.bio}
                    </p>
                  </section>
                )}
                {profile.interests && profile.interests.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="flex items-center gap-3 text-label font-semibold">
                      <Heart className="size-4.5 text-sky" aria-hidden="true" />
                      {t('students.interests')}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <span key={interest} className="app-tag wrap-anywhere">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
                {profile.songUrl && (
                  <section className="space-y-4">
                    <h2 className="flex items-center gap-3 text-label font-semibold">
                      <Music2 className="size-4.5 text-sky" aria-hidden="true" />
                      {t('students.song')}
                    </h2>
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
                    <ul className="divide-y divide-white-10">
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
        {me && me.id !== profile.id && (
          <div className="mt-6 flex flex-col items-end gap-3">
            <ReportButton targetType="user" targetId={profile.id} />
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
    </UIPanel>
  );
}
