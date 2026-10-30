import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FEEDMOCKS } from '@/utils';
import { UIButton, UIPanel } from '@/ui/components';

type CampusQuestionProps = {
  answers: string[];
  onAnswer: () => void;
};

export function CampusQuestion({ answers, onAnswer }: CampusQuestionProps) {
  const { t } = useTranslation();
  return (
    <>
      <UIPanel className="p-5.5">
        <p className="mb-3.5 text-label font-medium text-white-80">
          {FEEDMOCKS.questionAuthor}{' '}
          <span className="app-tag float-right">{t('app.question')}</span>
        </p>
        <h2 className="text-card-title font-semibold tracking-[-0.6px]">{FEEDMOCKS.question}</h2>
        <blockquote className="my-3.5 rounded-2xl border border-white-5 bg-white-5 px-4 py-3.5 text-body leading-[1.45]">
          <p className="mb-1.5 text-detail font-semibold text-sky">{FEEDMOCKS.topAnswerAuthor}</p>
          {FEEDMOCKS.topAnswer}
        </blockquote>
        {answers.map((a, i) => (
          <p key={i} className="my-2 rounded-lg bg-white-5 p-3 text-label">
            {a}
          </p>
        ))}
        <div className="flex items-center justify-between">
          <span className="text-detail text-secondary">
            {t('app.answers', { count: 19 + answers.length })}
          </span>
          <UIButton size="sm" bg="secondary" leftIcon={MessageCircle} onClick={onAnswer}>
            {t('app.answer')}
          </UIButton>
        </div>
      </UIPanel>{' '}
    </>
  );
}
