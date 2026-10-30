import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { GUIDEMOCKS } from '@/utils';
import { UIEmpty, UIPanel, UISegmented, UITopbar } from '@/ui/components';
import { GuideMap } from '@/components/features/guide';

export const Route = createFileRoute('/_app/guide')({ component: GuidePage });
function GuidePage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>(t('app.groceries'));
  const [selected, setSelected] = useState(0);
  const showPlaces = category === t('app.groceries') || category === t('app.nearby');
  return (
    <div className="grid gap-5 xl:grid-cols-[440px_minmax(0,1fr)]">
      <div>
        <UITopbar title={t('guide.title')} subtitle={t('guide.subtitle')} />
        <UISegmented
          label={t('guide.title')}
          options={[t('app.groceries'), t('app.hangouts'), t('app.dorms'), t('app.nearby')]}
          value={category}
          onChange={setCategory}
        />
        <UIPanel className="mt-4.5 min-h-[540px] p-2 xl:min-h-[calc(100svh-210px)]">
          <div className="mb-0 flex items-center justify-between gap-3 px-3 py-3.5">
            <h2 className="text-label font-semibold">{t('app.cheapGroceries')}</h2>
            <span className="text-detail text-muted">{GUIDEMOCKS.placeCount}</span>
          </div>
          {showPlaces ? (
            <div className="space-y-0.5">
              {GUIDEMOCKS.places.map((place, i) => (
                <button
                  key={place.name}
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  className={`flex w-full gap-3 rounded-2xl p-3 text-left hover:bg-white-5 ${selected === i ? 'bg-white-10' : ''}`}
                >
                  <img
                    src={`/app/O0La0K-${i + 1}.jpg`}
                    alt=""
                    className="size-16 shrink-0 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{place.name}</h3>
                      <span className="rounded-full bg-blue-20 px-2 py-0.5 text-micro font-semibold text-sky">
                        {place.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-detail text-secondary">{place.address}</p>
                    <p className="mt-2 text-detail text-secondary">
                      <Star size={11} className="mr-1 inline fill-warning text-warning" />
                      {place.rating} · {place.distance}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <UIEmpty />
          )}
        </UIPanel>
      </div>
      <GuideMap selected={selected} onSelect={setSelected} showPlaces={showPlaces} />
    </div>
  );
}
