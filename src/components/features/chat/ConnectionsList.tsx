import { useTranslation } from 'react-i18next';

import { CONNECTIONSMOCKS } from '@/utils';
import { UIAvatar } from '@/ui/components';

export function ConnectionsList({
  selected,
  onOpen,
}: {
  selected: string;
  onOpen: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-0.5">
      {CONNECTIONSMOCKS.connections.map((person) => (
        <button
          key={person.id}
          type="button"
          onClick={() => onOpen(person.id)}
          aria-current={selected === person.id ? 'true' : undefined}
          className={`flex w-full items-center gap-3 rounded-2xl border border-transparent p-2.5 text-left transition-colors hover:bg-white-5 ${selected === person.id ? 'border-white-10 bg-white-10' : ''}`}
        >
          <UIAvatar imgSrc={`/app/kuQtw-${person.image}.jpg`} alt="" />
          <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.75">
            <strong className="truncate text-body font-semibold">{person.name}</strong>
            <span className="justify-self-end text-detail text-secondary">{t('app.sayHi')}</span>
            <span className="block min-h-5 truncate text-label text-secondary">{person.meta}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
