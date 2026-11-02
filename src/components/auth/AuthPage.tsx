import { Warp } from '@paper-design/shaders-react';
import { BrandBackground, UIButton, UILanguageSwitcher, UIText } from '@/ui/components';
import { useReducedMotion } from '@react-spring/web';
import { type ReactNode } from 'react';
import { AuthBrand } from './AuthBrand';

const INK_COLORS = ['#0c0d14', '#121633', '#1e2a78', '#3b3cff'];

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-svh">
      <BrandBackground className="relative flex min-h-svh flex-col overflow-hidden md:flex-row">
        <Warp
          className="pointer-events-none absolute inset-0"
          colors={INK_COLORS}
          proportion={0.9}
          softness={0.5}
          distortion={0.2}
          swirl={0.8}
          swirlIterations={10}
          shape="edge"
          shapeScale={0.2}
          scale={0.6}
          rotation={4}
          speed={reduceMotion ? 0 : 5}
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/25" />
        <div className="relative flex flex-1 px-6 py-8 sm:px-12 lg:px-16">
          <AuthBrand />
        </div>
        <div className="absolute top-6 right-6 z-10 sm:right-12 md:top-8 md:right-8 lg:right-12">
          <UILanguageSwitcher />
        </div>
        {/* Phone: bottom sheet. Tablet and up: full-height side panel. */}
        <section className="relative flex flex-col border-t border-white/10 bg-ink/50 px-6 pt-8 pb-10 shadow-2xl backdrop-blur-xs sm:px-12 md:w-1/2 md:justify-center md:border-t-0 md:border-l md:px-8 md:py-12 lg:w-1/3 lg:min-w-110 lg:px-12">
          <div className="mx-auto flex w-full max-w-110 flex-col">
            {import.meta.env.DEV ? (
              <UIButton bg="secondary" size="pill" navigateTo="/feed" className="mb-6 self-end">
                Skip login (dev) → Feed
              </UIButton>
            ) : null}
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
