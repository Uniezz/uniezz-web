import { UIButton, UIText } from '@/ui/components';
import { ChevronDown, Globe } from 'lucide-react';
import { type ReactNode } from 'react';
import { AuthBrand } from './AuthBrand';

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
    <main className="page">
      <div className="flex h-full w-full">
        <AuthBrand />
        <div className="flex h-full w-3/5 flex-col items-center justify-center gap-5 overflow-y-auto bg-ice py-6">
          <div className="flex w-full max-w-120 justify-end">
            <UIButton leftIconColor="gray" leftIcon={Globe} bg="secondary" size="pill">
              <UIText weight="semibold" size="sm">
                EN
              </UIText>
              <ChevronDown className="text-gray" size={14} />
            </UIButton>
          </div>
          <div className="flex w-full max-w-120 flex-col gap-6 rounded-2xl bg-white-primary px-9 py-8.5">
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
          </div>
          <UIText size="sm" color="secondary">
            By continuing you agree to the Terms of Use and Privacy Policy · GDPR
          </UIText>
        </div>
      </div>
    </main>
  );
};
