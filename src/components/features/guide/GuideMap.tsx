import { useState } from 'react';
import { MapPin, Minus, Navigation, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// TODO(api): Replace mock map places with API-backed guide data.
import { GUIDEMOCKS } from '@/utils';
import { UIButton, UIPanel } from '@/ui/components';

export function GuideMap({
  selected,
  onSelect,
  showPlaces,
}: {
  selected: number;
  onSelect: (index: number) => void;
  showPlaces: boolean;
}) {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const current = GUIDEMOCKS.places[selected];
  return (
    <div className="relative min-h-[580px] overflow-hidden rounded-feature border border-white-10 xl:min-h-[calc(100svh-56px)]">
      <div
        className="absolute inset-0 transition-transform motion-reduce:transition-none"
        style={{ transform: `scale(${zoom})` }}
      >
        <img src="/app/map.png" alt={t('app.mapDescription')} className="size-full object-cover" />
        <div className="absolute inset-0 bg-ink/15" />
        {showPlaces &&
          GUIDEMOCKS.places.map((place, i) => (
            <button
              key={place.name}
              style={{ left: `${place.x}%`, top: `${place.y}%` }}
              aria-pressed={selected === i}
              onClick={() => onSelect(i)}
              className={`absolute flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1.75 text-detail font-semibold whitespace-nowrap shadow-lg focus-visible:outline-2 focus-visible:outline-blue ${selected === i ? 'bg-white text-ink' : 'bg-ink-70 text-white'}`}
            >
              <MapPin size={12} />
              {place.name}
            </button>
          ))}
        <span className="absolute top-[36%] left-[39%] size-5.5 rounded-full border-2 border-white bg-blue shadow-lg" />
      </div>
      <div className="absolute top-5 right-5 flex flex-col gap-1">
        <UIButton
          size="icon"
          bg="secondary"
          className="bg-ink-70"
          aria-label={t('landing.map.zoomIn')}
          disabled={zoom >= 2}
          onClick={() => setZoom(Math.min(2, zoom + 0.25))}
        >
          <Plus size={17} />
        </UIButton>
        <UIButton
          size="icon"
          bg="secondary"
          className="bg-ink-70"
          aria-label={t('landing.map.zoomOut')}
          disabled={zoom <= 1}
          onClick={() => setZoom(Math.max(1, zoom - 0.25))}
        >
          <Minus size={17} />
        </UIButton>
      </div>
      {showPlaces && (
        <UIPanel className="absolute bottom-5 left-5 flex w-[min(400px,calc(100%-40px))] flex-wrap items-center gap-3.5 rounded-profile bg-ink-70 p-3">
          <img
            src={`/app/O0La0K-${selected + 1}.jpg`}
            alt=""
            className="size-20 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-md font-semibold">{current.name}</h2>
            <p className="mt-1 text-detail text-secondary">
              {current.distance} · {current.tag}
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${current.name}, ${current.address}, Lublin`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-detail font-semibold text-ink"
            >
              <Navigation size={13} />
              {t('app.directions')}
            </a>
          </div>
        </UIPanel>
      )}
    </div>
  );
}
