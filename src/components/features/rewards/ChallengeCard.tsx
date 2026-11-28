import { Check, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMyChallenges, usePhoneViewport } from '@/hooks';
import { UICoin, UIPanel, UIQueryError } from '@/ui/components';
import { cn } from '@/ui/cn';
import { challengeText, formatCompactNumber } from '@/utils';
import { ProgressTrack } from './QuestCard';

const periodLabels = {
  day: 'rewards.challengeDaily',
  week: 'rewards.challengeWeekly',
  once: null,
} as const;

/** Running challenges with their progress; each pays its reward once per period. */
export function ChallengeCard() {
  const { t, i18n } = useTranslation();
  const { data, isError, refetch } = useMyChallenges();
  const isPhone = usePhoneViewport();
  const challenges = data?.items ?? [];
  const language = i18n.resolvedLanguage;
  const formatDate = new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' });

  // on a phone the app offers a retry when they fail
  if (isPhone && isError) return <UIQueryError retry={() => void refetch()} />;
  // Loading and errors stay silent: challenges are optional extras next to the quests.
  if (challenges.length === 0) return null;
  if (isPhone) {
    const formatDay = new Intl.DateTimeFormat(language, { dateStyle: 'medium' });
    // the mobile app's ChallengesCard: icon, title and reward on one row, the bar beside its count
    return (
      <section className="flex flex-col gap-4 rounded-2xl p-4 glass">
        <h2 className="text-body font-semibold">{t('rewards.challengesTitle')}</h2>
        {challenges.map((challenge) => {
          const { title, description } = challengeText(challenge.texts, language);
          const progress = Math.min(challenge.progress, challenge.target);
          const period = periodLabels[challenge.period];
          const meta = [
            period ? t(period) : null,
            challenge.endsAt
              ? t('rewards.challengeUntil', { date: formatDay.format(new Date(challenge.endsAt)) })
              : null,
          ].filter(Boolean);
          const Icon = challenge.completed ? Check : Timer;
          return (
            <div key={challenge.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <Icon
                  size={16}
                  aria-hidden="true"
                  className={cn('shrink-0', challenge.completed ? 'text-green' : 'text-white-60')}
                />
                <span className="min-w-0 flex-1 text-body wrap-anywhere">{title}</span>
                <span className="flex shrink-0 items-center gap-1 text-detail font-semibold text-amber">
                  <UICoin />
                  {formatCompactNumber(challenge.reward, language)}
                </span>
              </div>
              {description && <p className="text-detail text-secondary">{description}</p>}
              <div className="flex items-center gap-2.5">
                <ProgressTrack
                  label={title}
                  value={progress}
                  max={challenge.target}
                  isDone={challenge.completed}
                />
                <span className="text-detail text-secondary tabular-nums">
                  {formatCompactNumber(progress, language)}/
                  {formatCompactNumber(challenge.target, language)}
                </span>
              </div>
              {meta.length > 0 && <p className="text-micro text-secondary">{meta.join(' · ')}</p>}
            </div>
          );
        })}
      </section>
    );
  }

  return (
    <UIPanel className="space-y-5 max-lg:space-y-4 max-lg:rounded-2xl max-lg:p-4">
      <h2 className="text-section font-semibold max-lg:text-body">
        {t('rewards.challengesTitle')}
      </h2>
      <ul className="space-y-5">
        {challenges.map((challenge) => {
          const { title, description } = challengeText(challenge.texts, language);
          const progress = Math.min(challenge.progress, challenge.target);
          const until = challenge.resetsAt ?? challenge.endsAt;
          return (
            <li key={challenge.id} className="space-y-2">
              <div className="flex items-baseline justify-between gap-3 text-label">
                <span className="min-w-0 font-medium max-lg:wrap-anywhere">{title}</span>
                <span
                  className={cn(
                    'text-detail tabular-nums',
                    challenge.completed ? 'text-success' : 'text-secondary',
                  )}
                >
                  {formatCompactNumber(progress, language)}/
                  {formatCompactNumber(challenge.target, language)}
                </span>
              </div>
              {description && <p className="text-detail text-secondary">{description}</p>}
              <div
                role="progressbar"
                aria-label={title}
                aria-valuemin={0}
                aria-valuemax={challenge.target}
                aria-valuenow={progress}
                className="h-1 overflow-hidden rounded-full bg-white-10 max-lg:h-1.5"
              >
                <div
                  className={cn(
                    'h-full rounded-full',
                    challenge.completed ? 'bg-success' : 'bg-white max-lg:bg-amber',
                  )}
                  style={{
                    width: `${challenge.target > 0 ? (progress / challenge.target) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="flex items-center gap-2 text-detail text-secondary max-lg:flex-wrap">
                <UICoin />
                <span className={cn(challenge.completed && 'text-success')}>
                  {t(challenge.completed ? 'rewards.challengeDone' : 'rewards.challengeReward', {
                    amount: formatCompactNumber(challenge.reward, language),
                  })}
                </span>
                {until && (
                  <span className="ml-auto">
                    {t(challenge.resetsAt ? 'rewards.challengeResets' : 'rewards.challengeEnds', {
                      date: formatDate.format(new Date(until)),
                    })}
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </UIPanel>
  );
}
