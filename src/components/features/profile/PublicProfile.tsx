import { GraduationCap, Heart, Mail, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { components } from '@/@types/schema';
import { useMyProfile, useUniversities } from '@/hooks';
import { UIPanel } from '@/ui/components';
import { ReportButton } from '@/components/features/reports/ReportButton';
import { authorName } from '@/utils/feed';
import { cn } from '@/ui/cn';

export function PublicProfile({ profile }: { profile: components['schemas']['PublicProfile'] }) {
  const { t } = useTranslation();
  const { data: me } = useMyProfile();
  const { data: universities } = useUniversities();
  const university =
    universities?.find((item) => item.id === profile.universityId)?.name ??
    profile.universityId.toUpperCase();
  const hasPersonalDetails = Boolean(profile.bio || profile.interests?.length);
  const hasStudyDetails = Boolean(profile.programmes?.length || profile.email);

  return (
    <div className="space-y-5">
      <UIPanel className="overflow-hidden p-0">
        <div
          aria-hidden="true"
          className="nav-item-active h-20 after:right-5 after:size-14 sm:h-24 sm:after:right-8 sm:after:size-18"
        />
        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="relative flex items-start gap-4 sm:gap-5">
            <img
              src={profile.avatarUrl ?? '/app/avatar.png'}
              alt=""
              className="-mt-8 size-20 shrink-0 rounded-full border-4 border-surface bg-surface object-cover sm:-mt-10 sm:size-24"
            />
            <div className="min-w-0 flex-1 pt-4 sm:pt-5">
              <h1 className="text-card-title font-bold tracking-[-0.6px] wrap-anywhere sm:text-xxl">
                {authorName(profile) || t('apiState.student')}
              </h1>
              <p className="mt-2 text-label leading-relaxed wrap-anywhere text-secondary">
                {university}
              </p>
            </div>
            {me && me.id !== profile.id && (
              <div className="shrink-0 pt-4 sm:pt-5">
                <ReportButton targetType="user" targetId={profile.id} compact />
              </div>
            )}
          </div>
        </div>
      </UIPanel>

      {(hasPersonalDetails || hasStudyDetails) && (
        <div
          className={cn(
            'grid items-start gap-5',
            hasPersonalDetails &&
              hasStudyDetails &&
              'md:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)]',
          )}
        >
          {hasPersonalDetails && (
            <div className="min-w-0 space-y-5">
              {profile.bio && (
                <UIPanel className="space-y-4 p-5 sm:p-6">
                  <h2 className="flex items-center gap-2.5 text-section font-semibold">
                    <UserRound className="size-4.5 text-sky" aria-hidden="true" />
                    {t('students.bio')}
                  </h2>
                  <p className="text-body leading-relaxed wrap-anywhere whitespace-pre-wrap text-white-80">
                    {profile.bio}
                  </p>
                </UIPanel>
              )}
              {profile.interests && profile.interests.length > 0 && (
                <UIPanel className="space-y-4 p-5 sm:p-6">
                  <h2 className="flex items-center gap-2.5 text-section font-semibold">
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
                </UIPanel>
              )}
            </div>
          )}
          {hasStudyDetails && (
            <div className="min-w-0 space-y-5">
              {profile.programmes && profile.programmes.length > 0 && (
                <UIPanel className="space-y-4 p-5 sm:p-6">
                  <h2 className="flex items-center gap-2.5 text-section font-semibold">
                    <GraduationCap className="size-4.5 text-sky" aria-hidden="true" />
                    {t('app.studyProgrammes')}
                  </h2>
                  <div className="divide-y divide-white-10">
                    {profile.programmes.map((programme, index) => (
                      <div key={index} className="space-y-2 py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="min-w-0 text-label font-semibold wrap-anywhere">
                            {programme.programme}
                          </h3>
                          {programme.isPrimary && (profile.programmes?.length ?? 0) > 1 && (
                            <span className="rounded-full bg-blue-20 px-2.5 py-1 text-micro font-semibold text-sky">
                              {t('app.primary')}
                            </span>
                          )}
                        </div>
                        {programme.faculty && (
                          <p className="text-detail leading-relaxed wrap-anywhere text-secondary">
                            {programme.faculty}
                          </p>
                        )}
                        {programme.yearOfStudy != null && (
                          <p className="text-detail text-secondary">
                            {t('app.studyYear', { year: programme.yearOfStudy })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </UIPanel>
              )}
              {profile.email && (
                <UIPanel className="space-y-3 p-5 sm:p-6">
                  <h2 className="flex items-center gap-2.5 text-section font-semibold">
                    <Mail className="size-4.5 text-sky" aria-hidden="true" />
                    {t('auth.otp.emailLabel')}
                  </h2>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-block max-w-full rounded-sm text-label wrap-anywhere text-white-80 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-blue"
                  >
                    {profile.email}
                  </a>
                </UIPanel>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
