import { useDropdown } from '@/hooks/useDropdown';
import { BrandBackground, UIButton, UIMenu, UIText } from '@/ui/components';
import { LNG_OPTIONS } from '@/utils';
import { ChevronDown, Globe } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthBrand } from './AuthBrand';

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t, i18n } = useTranslation();
  const { ref: lngMenuRef, isOpen: isLngOpen, toggle: toggleLngMenu } = useDropdown();

  return (
    <main className="min-h-svh">
      <BrandBackground className="relative min-h-svh overflow-hidden px-6 py-8 sm:px-12 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-ink/25" />
        <div className="relative mx-auto flex min-h-[calc(100svh-64px)] max-w-360 flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          <AuthBrand />
          <div className="flex w-full flex-col items-center justify-center pb-8 lg:w-120 lg:shrink-0 lg:pb-0">
            <div className="absolute top-0 right-0 z-10" ref={lngMenuRef}>
              <UIButton
                leftIconColor="white"
                leftIcon={Globe}
                bg="secondary"
                size="pill"
                onClick={toggleLngMenu}
                aria-label={t('topbar.changeLanguage')}
                aria-expanded={isLngOpen}
              >
                {t('topbar.languageCode')}
                <ChevronDown size={14} />
              </UIButton>
              {isLngOpen ? (
                <UIMenu
                  options={LNG_OPTIONS}
                  value={i18n.resolvedLanguage ?? i18n.language}
                  onSelect={(language) => void i18n.changeLanguage(language)}
                />
              ) : null}
            </div>
            {import.meta.env.DEV ? (
              <UIButton bg="secondary" size="pill" navigateTo="/feed" className="mb-3 self-end">
                Skip login (dev) → Feed
              </UIButton>
            ) : null}
            <div className="w-full rounded-[32px] border border-white/10 bg-ink/90 p-6 shadow-2xl backdrop-blur-3xl sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </BrandBackground>
    </main>
  );
};

type AuthPageProps = {
  children: ReactNode;
  topText: string;
  bottomText: string;
  beforeTitle?: ReactNode;
  headingIcon?: ReactNode;
};

export const AuthPage = ({
  children,
  topText,
  bottomText,
  beforeTitle,
  headingIcon,
}: AuthPageProps) => (
  <div className="flex flex-col gap-6">
    {beforeTitle}
    <div className="flex flex-col items-start gap-2">
      {headingIcon}
      <UIText as="h2" size="xl" weight="semibold">
        {topText}
      </UIText>
      <UIText size="sm" color="secondary" className="leading-5">
        {bottomText}
      </UIText>
    </div>
    {children}
  </div>
);
