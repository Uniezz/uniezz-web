import { Check, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DailyQuests } from '@/@types';
import { usePhoneViewport } from '@/hooks';
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
  const isPhone = usePhoneViewport();
  if (isPhone) {
    // the mobile app's QuestCard: a glass card, an icon per quest, a plain reward line
    return (
      <section className="flex flex-col gap-3.5 rounded-2xl p-4 glass">
        <div className="flex items-center gap-2">
          <h2 className="min-w-0 flex-1 text-body font-semibold">{t('rewards.questsTitle')}</h2>
          <p className="text-micro text-secondary">
            {t('rewards.questsResets', { time: resetsAt })}
          </p>
        </div>
        {(quests.quests ?? []).map((quest) => {
          const progress = Math.min(quest.progress, quest.target);
          const label = t(questLabel(quest.quest));
          const Icon = quest.done ? Check : Timer;
          return (
            <div key={quest.quest} className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <Icon
                  size={16}
                  aria-hidden="true"
                  className={cn('shrink-0', quest.done ? 'text-green' : 'text-white-60')}
                />
                <span className="min-w-0 flex-1 text-body">{label}</span>
                <span className="text-detail text-secondary tabular-nums">
                  {formatCompactNumber(progress, i18n.resolvedLanguage)}/
                  {formatCompactNumber(quest.target, i18n.resolvedLanguage)}
                </span>
              </div>
              <ProgressTrack
                label={label}
                value={progress}
                max={quest.target}
                isDone={quest.done}
              />
            </div>
          );
        })}
        <p className={cn('text-detail', quests.completed ? 'text-green' : 'text-secondary')}>
          {t(quests.completed ? 'rewards.questsDone' : 'rewards.questsReward', {
            amount: formatCompactNumber(quests.reward, i18n.resolvedLanguage),
          })}
        </p>
      </section>
    );
  }
  return (
    <UIPanel className="space-y-5 max-lg:space-y-3.5 max-lg:rounded-2xl max-lg:p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-section font-semibold max-lg:text-body">{t('rewards.questsTitle')}</h2>
        <p className="text-detail text-secondary">
          {t('rewards.questsResets', { time: resetsAt })}
        </p>
      </div>
      <ul className="space-y-5 max-lg:space-y-3.5">
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
                className="h-1 overflow-hidden rounded-full bg-white-10 max-lg:h-1.5"
              >
                <div
                  className={cn(
                    'h-full rounded-full',
                    quest.done ? 'bg-success' : 'bg-white max-lg:bg-amber',
                  )}
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

/** The mobile app's 6px progress track: amber, green once done. */
export function ProgressTrack({
  label,
  value,
  max,
  isDone,
}: {
  label: string;
  value: number;
  max: number;
  isDone: boolean;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-[3px] bg-white-10"
    >
      <div
        className={cn('h-full', isDone ? 'bg-green' : 'bg-amber')}
        style={{ width: `${max > 0 ? Math.min(value / max, 1) * 100 : 0}%` }}
      />
    </div>
  );
}
