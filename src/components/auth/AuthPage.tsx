import { UIButton, UIText } from '@/ui/components';
import { ChevronDown, Globe } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthBrand } from './AuthBrand';

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation();

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
            {children}
          </div>
          <UIText size="sm" color="secondary">
            {t('auth.terms')}
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
