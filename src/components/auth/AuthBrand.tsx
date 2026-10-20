import { UIText } from '@/ui/components';
import {
  GraduationCapIcon,
  LibraryBig,
  Lock,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ParseKeys } from 'i18next';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

type ContentItem = {
  icon: LucideIcon;
  topText: ParseKeys;
  bottomText: ParseKeys;
};

const CONTENT_ITEMS: ContentItem[] = [
  {
    icon: ShieldCheck,
    topText: 'auth.brand.verifiedTitle',
    bottomText: 'auth.brand.verifiedText',
  },
  {
    icon: Users,
    topText: 'auth.brand.communityTitle',
    bottomText: 'auth.brand.communityText',
  },
  {
    icon: LibraryBig,
    topText: 'auth.brand.examsTitle',
    bottomText: 'auth.brand.examsText',
  },
];

export const AuthBrand = memo(function AuthBrand() {
  const { t } = useTranslation();

  return (
    <div className="flex w-2/5 flex-col justify-between bg-mesh px-14 py-13">
      <div className="flex items-center justify-start gap-3">
        <div className="flex items-center justify-center rounded-xl bg-blue-light p-3">
          <GraduationCapIcon size={22} className="text-white-primary" />
        </div>
        <UIText color="white" size="xl" weight="bold">
          Uniezz
        </UIText>
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4.5">
          <UIText size="extra" weight="bold" color="white">
            {t('auth.brand.headline')}
          </UIText>
          <UIText color="gray" weight="semibold">
            {t('auth.brand.description')}
          </UIText>
        </div>
        <div className="flex flex-col items-start justify-center gap-5">
          {CONTENT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div className="flex flex-row gap-3.5" key={item.topText}>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FFFFFF14]">
                  <Icon className="text-white-primary" size={17} />
                </div>
                <div className="flex flex-col">
                  <UIText weight="semibold" color="white">
                    {t(item.topText)}
                  </UIText>
                  <UIText color="gray" size="sm">
                    {t(item.bottomText)}
                  </UIText>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2.5 rounded-xl border border-blue bg-[#FFFFFF0D] px-4 py-3.5">
        <Lock className="text-gray" size={16} />
        <UIText size="sm" color="gray">
          {t('auth.brand.privacy')}
        </UIText>
      </div>
    </div>
  );
});
