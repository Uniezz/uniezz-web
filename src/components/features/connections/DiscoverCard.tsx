import { Flag } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { DiscoveryCard } from '@/@types';
import { ReportButton } from '@/components/features/reports';
import { cn } from '@/ui/cn';
import { UIButton } from '@/ui/components';
import { studyLevelLabels, UNIVERSITY_SHORT_NAMES } from '@/utils';
import { InterestChips } from './InterestChips';

/**
 * Phone-only: the mobile app's DiscoverCard — the photo on top (tap a half to flip, clamped at the
 * ends) with the name over its bottom, and the details scrolling below in up to 40% of the card.
 */
export function DiscoverCard({
  card,
  onReported,
}: {
  card: DiscoveryCard;
  onReported: () => void;
}) {
  const { t } = useTranslation();
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = card.photos ?? [];
  const facts = [
    card.age === null ? null : String(card.age),
    card.level && t(studyLevelLabels[card.level]),
    UNIVERSITY_SHORT_NAMES[card.universityId] ?? card.universityId,
  ].filter(Boolean);
  const handlePrevious = () => setPhotoIndex((index) => Math.max(0, index - 1));
  const handleNext = () => setPhotoIndex((index) => Math.min(photos.length - 1, index + 1));

  const header = (
    <div className="flex items-center gap-2">
      {/* lets a tap on the name over the photo still flip it */}
      <div className="pointer-events-none flex min-w-0 flex-1 flex-col gap-0.5">
        <h2 className="truncate text-[21px] font-bold">
          {card.student.firstName ?? t('apiState.student')}
        </h2>
        <p className="text-label font-medium text-white-80">{facts.join(' · ')}</p>
      </div>
      <ReportButton
        targetType="candidate"
        targetId={card.candidateId}
        placement="bottom"
        onSent={onReported}
        renderTrigger={({ label, onOpen }) => (
          <UIButton size="square" bg="glass" aria-label={label} onClick={onOpen}>
            <Flag size={18} aria-hidden="true" />
          </UIButton>
        )}
      />
    </div>
  );

  return (
    <article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white-10 bg-surface-60">
      {photos.length > 0 ? (
        <div className="relative min-h-0 flex-1 bg-surface">
          {/* all stacked, only the current one shown, so a flip doesn't wait for a download */}
          {photos.map((url, index) => (
            <img
              key={url}
              src={url}
              alt=""
              className={cn(
                'absolute inset-0 size-full object-cover',
                index !== photoIndex && 'opacity-0',
              )}
            />
          ))}
          <div className="absolute inset-0 flex">
            <button
              type="button"
              aria-label={t('postComposer.previousPhoto')}
              data-ph-capture-attribute-label="Previous candidate photo"
              onClick={handlePrevious}
              className="flex-1 focus-visible:outline-2 focus-visible:outline-blue"
            />
            <button
              type="button"
              aria-label={t('postComposer.nextPhoto')}
              data-ph-capture-attribute-label="Next candidate photo"
              onClick={handleNext}
              className="flex-1 focus-visible:outline-2 focus-visible:outline-blue"
            />
          </div>
          {photos.length > 1 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-2.5 top-2 flex gap-1"
            >
              {photos.map((url, index) => (
                <span
                  key={url}
                  className={cn(
                    'h-0.75 flex-1 rounded-xs',
                    index === photoIndex ? 'bg-white' : 'bg-white-40',
                  )}
                />
              ))}
            </div>
          )}
          {/* darkens the photo's bottom so the name reads on any picture */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-b from-ink-0 to-ink-70 p-3.5 pt-10 [&_button]:pointer-events-auto">
            {header}
          </div>
        </div>
      ) : (
        <div className="p-3.5 pb-0">{header}</div>
      )}
      <div
        className={cn(
          'scrollbar-hidden flex flex-col gap-4 overflow-y-auto p-3.5',
          photos.length > 0 ? 'max-h-[40%] shrink-0' : 'min-h-0 flex-1',
        )}
      >
        {card.intent && (
          <section className="flex flex-col gap-1.5">
            <p className="text-micro font-semibold text-sky">{t('connections.lookingFor')}</p>
            <p className="text-[21px] font-bold wrap-anywhere">{card.intent}</p>
          </section>
        )}
        {card.bio && (
          <p className="text-base leading-6 wrap-anywhere whitespace-pre-wrap text-white-80">
            {card.bio}
          </p>
        )}
        {card.sharedInterests?.length ? (
          <section className="flex flex-col gap-1.5">
            <p className="text-micro font-semibold text-sky">{t('connections.inCommon')}</p>
            <InterestChips interests={card.sharedInterests} label={t('connections.inCommon')} />
          </section>
        ) : null}
        {card.interests?.length ? (
          <section className="flex flex-col gap-1.5">
            <p className="text-micro font-semibold text-secondary">{t('connections.interests')}</p>
            <InterestChips interests={card.interests} label={t('connections.interests')} />
          </section>
        ) : null}
      </div>
    </article>
  );
}
