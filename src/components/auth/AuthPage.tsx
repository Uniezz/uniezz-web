import { BrandBackground, UILanguageSwitcher, UIText } from '@/ui/components';
import { type ReactNode } from 'react';
import { AuthBrand } from './AuthBrand';

type AuthLayoutProps = {
  children: ReactNode;
  /** Replaces the brand column, e.g. with step copy during onboarding */
  aside?: ReactNode;
};

export const AuthLayout = ({ children, aside }: AuthLayoutProps) => {
  return (
    <main className="min-h-svh">
      <BrandBackground
        variant="app"
        className="relative flex min-h-svh flex-col overflow-hidden max-lg:overflow-clip lg:flex-row"
      >
        <div className="relative flex flex-1 px-6 py-8 max-lg:flex-none max-lg:px-5 max-lg:pt-[calc(env(safe-area-inset-top)+12px)] max-lg:pb-0 lg:px-16">
          {aside ?? <AuthBrand />}
        </div>
        <div className="absolute top-6 right-6 z-10 max-lg:top-[calc(env(safe-area-inset-top)+16px)] max-lg:right-5 lg:top-8 lg:right-12">
          <UILanguageSwitcher />
        </div>
        {/* Phone: full screen under the wordmark, content at the bottom, as in the app. Desktop: full-height side panel. */}
        <section className="relative flex flex-col border-white/10 max-lg:flex-1 max-lg:px-5 max-lg:pt-6 lg:w-1/3 lg:min-w-110 lg:justify-center lg:border-l lg:bg-ink/50 lg:px-12 lg:py-12 lg:shadow-2xl lg:backdrop-blur-xs">
          <div className="mx-auto flex w-full max-w-110 flex-col max-lg:flex-1 max-lg:justify-end">
            {children}
          </div>
        </section>
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
  <div className="flex flex-col gap-6 max-lg:gap-5 max-lg:pb-[calc(env(safe-area-inset-bottom)+8px)]">
    {beforeTitle}
    {/* on a phone, rises in like the mobile app's FadeInDown headline */}
    <div className="flex flex-col items-start gap-2 max-lg:px-1 max-lg:motion-safe:animate-rise-in">
      {headingIcon}
      <UIText
        as="h2"
        size="xl"
        weight="semibold"
        className="max-lg:max-w-full max-lg:text-[34px] max-lg:leading-tight max-lg:font-bold max-lg:tracking-[-1.2px] max-lg:break-words"
      >
        {topText}
      </UIText>
      <UIText
        size="sm"
        color="secondary"
        className="leading-5 max-lg:max-w-full max-lg:text-body max-lg:leading-[1.45] max-lg:break-words max-lg:text-white-80"
      >
        {bottomText}
      </UIText>
    </div>
    {children}
  </div>
);
