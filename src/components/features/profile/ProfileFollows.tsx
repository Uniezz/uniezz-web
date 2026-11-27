import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FollowList } from '@/@types';
import { cn } from '@/ui/cn';
import { FollowsDialog } from './FollowsDialog';

/** Follower and following counts; each opens its list. Without profileId they are the signed-in student's. */
export function ProfileFollows({
  profileId,
  name,
  followersCount,
  followingCount,
  className,
}: {
  profileId?: string;
  name: string;
  followersCount: number;
  followingCount: number;
  className?: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<FollowList | null>(null);
  const counts = { followers: followersCount, following: followingCount };

  return (
    <>
      <div className={cn('flex items-center gap-6', className)}>
        {(['followers', 'following'] as const).map((list) => (
          <button
            key={list}
            type="button"
            onClick={() => setOpen(list)}
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
        ))}
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
