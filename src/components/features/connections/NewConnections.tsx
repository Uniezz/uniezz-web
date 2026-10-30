import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { CONNECTIONSMOCKS } from '@/utils';
import { UIAvatar, UIPanel } from '@/ui/components';

export function NewConnections({ connected }: { connected: boolean }) {
  const { t } = useTranslation();
  return (
    <UIPanel>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-section font-semibold">{t('app.newConnections')}</h2>
        <span className="rounded-full bg-blue px-2 py-1 text-micro">{t('app.twoNew')}</span>
      </div>
      <div className="space-y-5">
        {[
          ...(connected ? [{ name: 'Zofia', meta: 'UMCS', image: 1 }] : []),
          ...CONNECTIONSMOCKS.connections,
        ].map((person) => (
          <div key={person.name} className="flex items-center gap-3">
            <UIAvatar imgSrc={`/app/kuQtw-${person.image}.jpg`} />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-body font-semibold">{person.name}</h3>
              <p className="text-detail text-secondary">{person.meta}</p>
            </div>
            <Link
              to="/chat"
              search={{ recipient: person.name }}
              className="rounded-full bg-white-10 px-4 py-2 text-label font-semibold"
            >
              {t('app.sayHi')}
            </Link>
          </div>
        ))}
      </div>
    </UIPanel>
  );
}
