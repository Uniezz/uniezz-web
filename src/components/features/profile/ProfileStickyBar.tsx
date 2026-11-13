import { useTranslation } from 'react-i18next';
import type { components } from '@/@types/schema';
import { UIAvatar, UIUniversityLogo } from '@/ui/components';
import { cn } from '@/ui/cn';
import { authorName } from '@/utils';

/** Compact profile row that slides in while the full profile card is scrolled above the viewport. */
export function ProfileStickyBar({
  profile,
  shown,
}: {
  profile: components['schemas']['PublicProfile'];
  shown: boolean;
}) {
  const { t } = useTranslation();

  return (
    // Decorative repeat of the card above. h-0 keeps it out of the layout; mb-0 beats the parent space-y.
    <div aria-hidden="true" className="sticky top-4 z-20 mb-0 h-0">
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border border-white-10 bg-surface-glass px-4 py-3 shadow-lg backdrop-blur-xl transition-[opacity,translate] duration-300 motion-reduce:transition-none',
          shown ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0',
        )}
      >
        <UIAvatar imgSrc={profile.avatarUrl ?? '/app/avatar.png'} alt="" className="shrink-0" />
        <p className="min-w-0 flex-1 truncate text-body font-semibold text-white">
          {authorName(profile) || t('apiState.student')}
        </p>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white-10 bg-white-5 py-1 pr-2 pl-1 text-micro font-semibold tracking-wide text-secondary">
          <UIUniversityLogo universityId={profile.universityId} />
          <span className="[text-box:trim-both_cap_alphabetic]">
            {profile.universityId.toUpperCase()}
          </span>
        </span>
      </div>
    </div>
  );
}
