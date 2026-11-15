import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UICoin } from '@/ui/components';

// Targets and rewards mirror the backend: 3 likes, 1 reply, 1 post pay 10 coins a day.
const quests = [
  { key: 'questLike', progress: '3/3', done: true },
  { key: 'questReply', progress: '1/1', done: true },
  { key: 'questPost', progress: '0/1', done: false },
] as const;

export function LandingCoinsPreview() {
  const { t } = useTranslation();

  return (
    <div className="landing-feature-art landing-faq-art" aria-hidden="true">
      <div className="landing-faq-sheet landing-coins-sheet">
        <p className="landing-faq-sheet-title flex items-center justify-between gap-4">
          {t('rewards.questsTitle')}
          <span className="landing-coins-balance">
            <UICoin size={24} />
            240
          </span>
        </p>
        <ul className="landing-faq-list">
          {quests.map(({ key, progress, done }) => (
            <li key={key}>
              <span className="flex items-center gap-2.5">
                <span className="landing-coins-check" data-done={done}>
                  {done && <Check size={12} strokeWidth={3} />}
                </span>
                {t(`rewards.${key}`)}
              </span>
              <span>{progress}</span>
            </li>
          ))}
          <li>
            <span>{t('rewards.questsReward', { amount: 10 })}</span>
            <span className="flex items-center gap-1.5">
              +10 <UICoin />
            </span>
          </li>
          <li>
            <span>{t('landing.preview.inviteFriend')}</span>
            <span className="flex items-center gap-1.5">
              +100 <UICoin />
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
