import { useTranslation } from 'react-i18next';
import type { DailyQuests } from '@/@types';
import { UICoin, UIPanel } from '@/ui/components';
import { cn } from '@/ui/cn';
import { formatCompactNumber, questLabel } from '@/utils';

export type QuestCardProps = { quests: DailyQuests };

/** Today's quests with their progress; the reward is paid once every quest is done. */
export function QuestCard({ quests }: QuestCardProps) {
  const { t, i18n } = useTranslation();
  const resetsAt = new Intl.DateTimeFormat(i18n.resolvedLanguage, { timeStyle: 'short' }).format(
    new Date(quests.resetsAt),
  );
  return (
    <UIPanel className="space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-section font-semibold">{t('rewards.questsTitle')}</h2>
        <p className="text-detail text-secondary">
          {t('rewards.questsResets', { time: resetsAt })}
        </p>
      </div>
      <ul className="space-y-5">
        {(quests.quests ?? []).map((quest) => {
          const progress = Math.min(quest.progress, quest.target);
          const label = t(questLabel(quest.quest));
          return (
            <li key={quest.quest} className="space-y-2">
              <div className="flex items-baseline justify-between gap-3 text-label">
                <span className="min-w-0">{label}</span>
                <span
                  className={cn(
                    'text-detail tabular-nums',
                    quest.done ? 'text-success' : 'text-secondary',
                  )}
                >
                  {formatCompactNumber(progress, i18n.resolvedLanguage)}/
                  {formatCompactNumber(quest.target, i18n.resolvedLanguage)}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={quest.target}
                aria-valuenow={progress}
                className="h-1 overflow-hidden rounded-full bg-white-10"
              >
                <div
                  className={cn('h-full rounded-full', quest.done ? 'bg-success' : 'bg-white')}
                  style={{ width: `${quest.target > 0 ? (progress / quest.target) * 100 : 0}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p
        className={cn(
          'flex items-center gap-2 border-t border-white-10 pt-4 text-label',
          quests.completed ? 'text-success' : 'text-secondary',
        )}
      >
        <UICoin />
        {t(quests.completed ? 'rewards.questsDone' : 'rewards.questsReward', {
          amount: formatCompactNumber(quests.reward, i18n.resolvedLanguage),
        })}
      </p>
    </UIPanel>
  );
}
