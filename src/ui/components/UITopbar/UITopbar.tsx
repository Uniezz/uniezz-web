import { Bell, ChevronDown, Globe, type LucideIcon, Search } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../cn';
import { UIButton } from '../UIButton';
import { UIText } from '../UIText';
import {
  topbarControlStyles,
  topbarSearchStyles,
  topbarStyles,
  topbarSubtitleStyles,
  topbarTitleStyles,
} from './variants';
import { LNG_OPTIONS } from '@/utils';
import { UIMenu } from '../UIMenu';

type UITopbarProps = ComponentProps<'header'> & {
  title: string;
  subtitle?: string;
  action?: { label: string; icon: LucideIcon; onClick?: () => void };
};

export const UITopbar = ({ title, subtitle, action, className, ...props }: UITopbarProps) => {
  const { t, i18n } = useTranslation();
  const [isLngOpen, setIsLngOpen] = useState(false);

  const toggleLngMenu = () => setIsLngOpen((prev) => !prev);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLngOpen(false);
  };

  return (
    <header className={cn(topbarStyles(), className)} {...props}>
      <div className="flex min-w-0 flex-col gap-px">
        <h1 className={topbarTitleStyles()}>{title}</h1>
        {subtitle ? <p className={topbarSubtitleStyles()}>{subtitle}</p> : null}
      </div>

      {/* TODO: connect to search API */}
      <label className={topbarSearchStyles()}>
        <Search className="shrink-0 text-muted" size={16} />
        <input
          type="text"
          aria-label={t('topbar.search')}
          placeholder={t('topbar.searchPlaceholder')}
          className="min-w-0 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-muted"
        />
      </label>

      <div className="flex-1" />

      <div className="relative">
        <UIButton
          bg="secondary"
          aria-label={t('topbar.changeLanguage')}
          aria-expanded={isLngOpen}
          className={topbarControlStyles({ kind: 'chip' })}
          onClick={toggleLngMenu}
        >
          <Globe className="text-secondary" size={16} />
          <span className="text-sm font-bold text-primary">{t('topbar.languageCode')}</span>
          <ChevronDown className="text-muted" size={14} />
        </UIButton>

        {isLngOpen ? (
          <UIMenu
            options={LNG_OPTIONS}
            value={i18n.resolvedLanguage ?? i18n.language}
            onSelect={changeLanguage}
          />
        ) : null}
      </div>

      {/* TODO: notifications */}
      <UIButton
        size="icon"
        bg="secondary"
        aria-label={t('topbar.notifications')}
        className={topbarControlStyles({ kind: 'icon' })}
      >
        <Bell className="text-secondary" size={17} />
        <span
          aria-hidden
          className="absolute top-2.25 right-2 size-2 rounded-full border-[1.5px] border-white-primary bg-danger"
        />
      </UIButton>

      {action ? (
        <UIButton
          bg="gradient"
          leftIcon={action.icon}
          onClick={action.onClick}
          className="shrink-0 px-5 py-2.75 shadow-[0_4px_12px_#2D419559]"
        >
          <UIText size="regular" weight="semibold" color="white">
            {action.label}
          </UIText>
        </UIButton>
      ) : null}
    </header>
  );
};
