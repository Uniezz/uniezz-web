import { UIRow, UIText } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { GraduationCapIcon, Lock } from 'lucide-react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { useState } from 'react';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
});
type ContentItem = {
  icon: IconName;
  topText: string;
  bottomText: string;
};

//TODO UNIFY current rows into UIRow
const CONTENT_ITEMS: ContentItem[] = [
  {
    icon: 'shield-check',
    topText: 'Verified students only',
    bottomText: 'Every account is checked against the university directory before it goes live.',
  },
  {
    icon: 'users',
    topText: 'Feed, chat and connections',
    bottomText: 'Meet people across UMCS, KUL, Politechnika, Przyrodniczy and WSEI.',
  },
  {
    icon: 'library-big',
    topText: 'Exams and course reviews',
    bottomText: 'A shared archive of past papers, syllabi and honest professor ratings.',
  },
];

const UNIVERSITIES = [
  {
    iconText: 'UM',
    topText: 'UMCS',
    bottomText: 'Maria Curie-Skłodowska · USOS',
  },
  {
    iconText: 'KUL',
    topText: 'KUL',
    bottomText: 'John Paul II Catholic · Microsoft',
  },
  {
    iconText: 'PL',
    topText: 'Politechnika Lubelska',
    bottomText: 'Lublin Tech · Microsoft',
  },
  {
    iconText: 'UP',
    topText: 'Uniwersytet Przyrodniczy',
    bottomText: 'Life Sciences · Microsoft',
  },
  {
    iconText: 'WS',
    topText: 'WSEI',
    bottomText: 'Economics & Innovation · Microsoft',
  },
];

function LoginPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<number>();

  return (
    <main className="page">
      <div className="flex h-full w-full">
        <div className="flex w-2/5 flex-col justify-between bg-mesh px-14 py-13">
          {/* Uniezz top  */}
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
              <UIText size={'extra'} weight={'bold'} color={'white'}>
                One platform for every student in Lublin.
              </UIText>
              <UIText color={'gray'} weight={'semibold'}>
                Five universities, one account. Sign in with the credentials you already use - your
                password stays on your university's own page.
              </UIText>
            </div>
            <div className="flex flex-col items-start justify-center gap-5">
              {CONTENT_ITEMS.map((item: ContentItem) => {
                return (
                  <div className="flex flex-row gap-3.5" key={item.icon}>
                    <div className="items-start justify-center self-start rounded-xl bg-[#FFFFFF14] p-3">
                      <DynamicIcon name={item.icon} className="text-white-primary" size={17} />
                    </div>
                    <div className="flex flex-col">
                      <UIText weight={'semibold'} color={'white'}>
                        {item.topText}
                      </UIText>
                      <UIText color={'gray'} size={'sm'}>
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
            <UIText size={'sm'} color={'gray'}>
              Uniezz never sees or stores your university password.
            </UIText>
          </div>
        </div>
        <div className="flex h-full w-3/5 items-center justify-center bg-ice">
          <div className="flex flex-col gap-6 rounded-2xl bg-white-primary px-9 py-8.5">
            <div className="flex flex-col gap-2">
              <UIText size={'xxl'} weight={'bold'}>
                Sign in to Uniezz
              </UIText>
              <UIText size={'regular'} color={'gray'}>
                Choose your university — you'll finish signing in on its own login page.
              </UIText>
            </div>
            <div>
              <UIText color={'gray'} weight={'bold'} size={'xs'}>
                YOUR UNIVERSITY
              </UIText>

              <div className="flex flex-col gap-2.5">
                {UNIVERSITIES.map(({ iconText, topText, bottomText }, index) => {
                  const isItemSelected: boolean = index === selectedUniversity;
                  const handleClick = () => {
                    setSelectedUniversity(index);
                  };
                  return (
                    <UIRow
                      key={iconText}
                      onClick={handleClick}
                      selected={isItemSelected}
                      iconText={iconText}
                      topText={topText}
                      bottomText={bottomText}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
