import { UIButton, UIText } from '@/ui/components';
import { ChevronDown, Globe } from 'lucide-react';
import { type ReactNode } from 'react';
import { AuthBrand } from './AuthBrand';

type AuthLayoutProps = {
  children: ReactNode;
  compact?: boolean;
};

export const AuthLayout = ({ children, compact = false }: AuthLayoutProps) => {
  return (
    <main className="page">
      <div className="flex h-full w-full">
        <AuthBrand />
        <div
          className={`flex h-full w-3/5 flex-col items-center justify-start overflow-y-auto bg-ice ${compact ? 'gap-2 py-2' : 'gap-3 py-4'}`}
        >
          <div className="mt-auto flex w-full max-w-120 items-center justify-end gap-2">
            {compact && import.meta.env.DEV ? (
              <UIButton bg="secondary" size="pill" navigateTo="/feed">
                <UIText size="sm" color="secondary">
                  Skip login (dev) → Feed
                </UIText>
              </UIButton>
            ) : null}
            <UIButton leftIconColor="gray" leftIcon={Globe} bg="secondary" size="pill">
              <UIText weight="semibold" size="sm">
                EN
              </UIText>
              <ChevronDown className="text-gray" size={14} />
            </UIButton>
          </div>
          <div
            className={`flex w-full max-w-120 flex-col rounded-2xl bg-white-primary ${compact ? 'gap-3 px-6 py-4' : 'gap-6 px-9 py-8.5'}`}
          >
            {children}
          </div>
          <UIText size="sm" color="secondary" className="mb-auto">
            By continuing you agree to the Terms of Use and Privacy Policy · GDPR
          </UIText>
        </div>
      </div>
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
}: AuthPageProps) => {
  return (
    <>
      {beforeTitle}
      <div className="flex flex-col items-start gap-2">
        {headingIcon}
        <UIText size="xxl" weight="bold">
          {topText}
        </UIText>
        <UIText size="regular" color="gray">
          {bottomText}
        </UIText>
      </div>
      {children}
    </>
  );
};
