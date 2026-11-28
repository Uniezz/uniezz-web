import { type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFeatureFlagEnabled } from '@posthog/react';
import { cn } from '../../cn';
import { UIButton } from '../UIButton';
import { UISearch } from '../UISearch';
import { UIAvatar } from '../UIAvatar';
import { UICoin } from '../UICoin';
import { useMyProfile } from '@/hooks';
import { formatCompactNumber } from '@/utils';
export type UITopbarProps = {
  title: string;
  subtitle?: string;
  action?: { label: string; icon: LucideIcon; onClick?: () => void };
  search?: { value: string; onChange: (value: string) => void; label: string };
  /** Round icon buttons on the title line, before the phone avatar; `danger` paints the icon red. */
  actions?: { label: string; icon: LucideIcon; onClick: () => void; danger?: boolean }[];
  children?: ReactNode;
  /** Phone-only controls on the title line, before the avatar, as the mobile app's header actions. */
  phoneActions?: ReactNode;
  /** The page scrolled: on a phone the title shrinks, as the mobile app's collapsing header. */
  compact?: boolean;
  /** On a phone, a back button before the title, as the mobile app's header. */
  onBack?: () => void;
  sticky?: boolean;
};
export function UITopbar({
  title,
  subtitle,
  action,
  search,
  actions,
  children,
  phoneActions,
  compact = false,
  onBack,
  sticky,
}: UITopbarProps) {
  const { t, i18n } = useTranslation();
  const { data: profile } = useMyProfile();
  const coinsEnabled = useFeatureFlagEnabled('coins') !== false;
  return (
    <header
      className={cn(
        // on a phone, the mobile app's 12px gap under the header
        'mb-6 flex flex-wrap items-end gap-3 max-lg:mb-3 max-lg:items-center max-lg:gap-2',
        // Bleeds over <main> padding so content scrolls under the blurred bar.
        sticky &&
          'scroll-blur sticky top-0 z-30 -mx-4 -mt-6 px-4 max-lg:pt-[calc(4px+env(safe-area-inset-top))] max-lg:pb-3 lg:-mx-10 lg:-mt-7 lg:px-10 lg:pt-7 lg:pb-4',
      )}
    >
      {onBack && (
        <UIButton
          size="icon"
          bg="secondary"
          onClick={onBack}
          aria-label={t('app.back')}
          className="shrink-0 max-lg:size-10 max-lg:rounded-xl max-lg:bg-surface-60 max-lg:backdrop-blur-xl lg:hidden"
        >
          <ArrowLeft size={18} />
        </UIButton>
      )}
      <div className="min-w-0 flex-1">
        {subtitle && (
          // the mobile app's tab headers have no subtitle
          <p className="mb-1.5 text-body leading-[1.2] font-medium text-secondary max-lg:hidden">
            {subtitle}
          </p>
        )}
        {/* on a phone, one line at the mobile app's 30px title size */}
        <h1
          className={cn(
            '-my-[0.2em] truncate py-[0.2em] text-[30px] leading-[30px] font-bold tracking-[-1px] lg:text-page-title lg:tracking-[-1.4px] lg:whitespace-normal',
            'origin-left motion-safe:transition-transform max-lg:duration-200',
            compact && 'max-lg:scale-92',
          )}
        >
          {title}
        </h1>
      </div>
      {search && (
        <div className="w-full max-lg:order-last sm:w-75">
          <UISearch
            {...search}
            className="gap-2.5 px-4 text-body backdrop-blur-[40px] [&_svg]:size-4.25"
          />
        </div>
      )}
      {/* on a phone, extra controls get their own row under the title, as in the mobile app */}
      {children && (
        <div className="flex flex-wrap items-center gap-2 max-lg:order-last max-lg:w-full lg:contents">
          {children}
        </div>
      )}
      {action && (
        <UIButton
          size="sm"
          leftIcon={action.icon}
          onClick={action.onClick}
          aria-label={action.label}
          className="max-lg:size-9.5 max-lg:min-h-0 max-lg:p-2"
        >
          <span className="max-lg:sr-only">{action.label}</span>
        </UIButton>
      )}
      {actions?.map(({ label, icon: Icon, onClick, danger }) => (
        <UIButton
          key={label}
          size="icon"
          bg="secondary"
          onClick={onClick}
          aria-label={label}
          className={cn(
            // on a phone, the mobile app's UIIconButton: 40, radius 12, glass
            'shrink-0 max-lg:size-10 max-lg:rounded-xl max-lg:bg-surface-60 max-lg:backdrop-blur-xl',
            danger && 'text-red',
          )}
        >
          <Icon size={18} />
        </UIButton>
      ))}
      {phoneActions && (
        <div className="flex shrink-0 items-center gap-2 lg:hidden">{phoneActions}</div>
      )}
      {/* the mobile app's header avatar: opens the profile, with the coin balance under it */}
      <Link
        to="/profile"
        data-ph-capture-attribute-label={t('app.profile')}
        aria-label={
          profile && coinsEnabled
            ? `${t('app.profile')}, ${t('rewards.balance')}: ${profile.coins}`
            : t('app.profile')
        }
        className="relative shrink-0 lg:hidden"
      >
        <UIAvatar
          size="regular"
          imgSrc={profile?.avatarUrl ?? '/app/avatar.png'}
          className="[&>div]:size-10"
        />
        {profile && coinsEnabled && (
          <span className="absolute -bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-amber-30 bg-ink px-[5px] py-px text-[10px] leading-[13px] font-semibold">
            <UICoin className="size-3.5" />
            {formatCompactNumber(profile.coins, i18n.resolvedLanguage)}
          </span>
        )}
      </Link>
    </header>
  );
}
