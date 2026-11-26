import { useTranslation } from 'react-i18next';
import { useMyChallenges } from '@/hooks';
import { UICoin, UIPanel } from '@/ui/components';
import { cn } from '@/ui/cn';
import { challengeText, formatCompactNumber, dateFormatter } from '@/utils';

/** Running challenges with their progress; each pays its reward once per period. */
export function ChallengeCard() {
  const { t, i18n } = useTranslation();
  const { data } = useMyChallenges();
  const challenges = data?.items ?? [];
  const language = i18n.resolvedLanguage;
  const formatDate = dateFormatter(language, { dateStyle: 'medium', timeStyle: 'short' });

  // Loading and errors stay silent: challenges are optional extras next to the quests.
  if (challenges.length === 0) return null;

  return (
    <UIPanel className="space-y-5">
      <h2 className="text-section font-semibold">{t('rewards.challengesTitle')}</h2>
      <ul className="space-y-5">
        {challenges.map((challenge) => {
          const { title, description } = challengeText(challenge.texts, language);
          const progress = Math.min(challenge.progress, challenge.target);
          const until = challenge.resetsAt ?? challenge.endsAt;
          return (
            <li key={challenge.id} className="space-y-2">
              <div className="flex items-baseline justify-between gap-3 text-label">
                <span className="min-w-0 font-medium">{title}</span>
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
                className="h-1 overflow-hidden rounded-full bg-white-10"
              >
                <div
                  className={cn(
                    'h-full rounded-full',
                    challenge.completed ? 'bg-success' : 'bg-white',
                  )}
                  style={{
                    width: `${challenge.target > 0 ? (progress / challenge.target) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="flex items-center gap-2 text-detail text-secondary">
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
