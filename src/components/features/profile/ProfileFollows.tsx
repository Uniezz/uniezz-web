import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FollowList } from '@/@types';
import { usePhoneViewport } from '@/hooks';
import { cn } from '@/ui/cn';
import { formatCompactNumber } from '@/utils';
import { FollowsDialog } from './FollowsDialog';

/** Follower and following counts; each opens its list. Without profileId they are the signed-in student's. */
export function ProfileFollows({
  profileId,
  name,
  followersCount,
  followingCount,
  inline = false,
  className,
}: {
  profileId?: string;
  name: string;
  followersCount: number;
  followingCount: number;
  /** The mobile app's counts: number and label on one line, the number compact. */
  inline?: boolean;
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState<FollowList | null>(null);
  const counts = { followers: followersCount, following: followingCount };
  const isPhone = usePhoneViewport();
  const navigate = useNavigate();
  // a phone pushes the lists as their own screen, as the app does
  const handleOpen = (list: FollowList) =>
    isPhone ? void navigate({ to: '/follows', search: { profileId, list } }) : setOpen(list);

  return (
    <>
      <div className={cn('flex items-center', inline ? 'gap-4' : 'gap-6', className)}>
        {(['followers', 'following'] as const).map((list) =>
          inline ? (
            <button
              key={list}
              type="button"
              onClick={() => handleOpen(list)}
              data-ph-capture-attribute-label={
                list === 'followers' ? 'Open followers' : 'Open following'
              }
              // the exact number stays in the accessible name
              aria-label={`${counts[list]} ${t(`follows.${list}`)}`}
              className="flex items-baseline gap-1 rounded-sm text-detail focus-visible:outline-2 focus-visible:outline-blue"
            >
              <span className="font-semibold text-white">
                {formatCompactNumber(counts[list], i18n.resolvedLanguage)}
              </span>
              <span className="text-secondary">{t(`follows.${list}`)}</span>
            </button>
          ) : (
            <button
              key={list}
              type="button"
              onClick={() => handleOpen(list)}
              data-ph-capture-attribute-label={
                list === 'followers' ? 'Open followers' : 'Open following'
              }
              className="rounded-sm text-left transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-blue"
            >
              <span className="block text-section leading-tight font-semibold text-white">
                {counts[list]}
              </span>
              <span className="text-detail text-secondary">{t(`follows.${list}`)}</span>
            </button>
          ),
        )}
      </div>
      {open && (
        <FollowsDialog
          profileId={profileId}
          name={name}
          list={open}
          onListChange={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
