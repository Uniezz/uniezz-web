import { ChevronDown, ChevronUp } from 'lucide-react';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type FaqItemProps = {
  question: string;
  answer: string;
  /** A proposal's review state, shown as a badge. */
  status?: 'proposed' | 'published' | 'rejected';
};

const statusLabels = {
  proposed: 'faq.statusProposed',
  published: 'faq.statusPublished',
  rejected: 'faq.statusRejected',
} as const;

/** The mobile app's FaqItem: a glass card that shows its answer on tap. */
export function FaqItem({ question, answer, status }: FaqItemProps) {
  const { t } = useTranslation();
  const answerId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const Chevron = isOpen ? ChevronUp : ChevronDown;
  const handleToggle = () => setIsOpen((open) => !open);
  return (
    <li className="flex flex-col gap-2 rounded-2xl p-3.5 glass">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        data-ph-capture-attribute-label="Toggle FAQ answer"
        onClick={handleToggle}
        className="flex items-center gap-3 text-left"
      >
        <span className="min-w-0 flex-1 text-body font-semibold wrap-anywhere">{question}</span>
        {status && (
          <span className="shrink-0 rounded-xl border border-white-10 bg-white-5 px-2 py-0.75 text-micro font-semibold text-secondary">
            {t(statusLabels[status])}
          </span>
        )}
        <Chevron size={16} aria-hidden="true" className="shrink-0" />
      </button>
      {isOpen && (
        <p id={answerId} className="text-body wrap-anywhere whitespace-pre-line text-secondary">
          {answer}
        </p>
      )}
    </li>
  );
}
