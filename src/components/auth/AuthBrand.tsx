import { UIText } from '@/ui/components';
import {
  GraduationCapIcon,
  LibraryBig,
  Lock,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { memo } from 'react';

type ContentItem = {
  icon: LucideIcon;
  topText: string;
  bottomText: string;
};

const CONTENT_ITEMS: ContentItem[] = [
  {
    icon: ShieldCheck,
    topText: 'Verified students only',
    bottomText: 'Every account is checked against the university directory before it goes live.',
  },
  {
    icon: Users,
    topText: 'Feed, chat and connections',
    bottomText: 'Meet people across UMCS, KUL, Politechnika, Przyrodniczy and WSEI.',
  },
  {
    icon: LibraryBig,
    topText: 'Exams and course reviews',
    bottomText: 'A shared archive of past papers, syllabi and honest professor ratings.',
  },
];

export const AuthBrand = memo(function AuthBrand() {
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
            One platform for every student in Lublin.
          </UIText>
          <UIText color="gray" weight="semibold">
            Lublin universities, one account. Sign in with the credentials you already use — your
            password stays on your university&apos;s own page.
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
                    {item.topText}
                  </UIText>
                  <UIText color="gray" size="sm">
                    {item.bottomText}
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
          Uniezz never sees or stores your university password.
        </UIText>
      </div>
    </div>
  );
});
