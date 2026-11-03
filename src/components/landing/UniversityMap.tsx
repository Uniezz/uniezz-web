import { useRef } from 'react';
import type { MapRef } from '@vis.gl/react-maplibre';
import { landingMotionQuery, useLandingScroll } from '@/hooks/useLandingScroll';
import { landingMapCamera, landingMapProgressForZoom } from '@/utils/landingMap';
import { useTranslation } from 'react-i18next';
import { UniversityMapCanvas } from './UniversityMapCanvas';
import type { University } from '@/@types/auth';

export function UniversityMap({
  universities,
  isLoading,
  isError,
}: {
  universities: University[];
  isLoading: boolean;
  isError: boolean;
}) {
  const { t } = useTranslation();
  const mapRef = useRef<MapRef>(null);
  const clusterProgress = useRef<number | null>(null);
  const { ref } = useLandingScroll(1, (progress, pinned) => {
    // Scrolling to a cluster must not overwrite its own camera animation.
    if (
      pinned &&
      clusterProgress.current !== null &&
      Math.abs(progress - clusterProgress.current) < 0.002
    )
      return;
    clusterProgress.current = null;
    mapRef.current?.jumpTo(landingMapCamera(pinned ? progress : 1));
  });
  const syncClusterProgress = (zoom: number) => {
    const section = ref.current;
    if (!section || !matchMedia(landingMotionQuery).matches) return;
    const current = Number(section.style.getPropertyValue('--progress') || 0);
    const progress = Math.max(current, landingMapProgressForZoom(zoom));
    clusterProgress.current = progress;
    const distance = section.offsetHeight - (section.firstElementChild?.clientHeight ?? 0);
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY - 80 + distance * progress,
      behavior: 'instant',
    });
  };
  const syncCamera = () => {
    const progress = Number(ref.current?.style.getPropertyValue('--progress') || 0);
    mapRef.current?.jumpTo(landingMapCamera(matchMedia(landingMotionQuery).matches ? progress : 1));
  };
  return (
    <section ref={ref} aria-label={t('landing.map.eyebrow')} className="landing-map">
      <div className="landing-map-stage">
        <div className="landing-map-heading landing-container">
          <h2 className="landing-display">{t('landing.map.title')}</h2>
          <p className="mt-4 max-w-100 text-body leading-relaxed text-secondary">
            {t('landing.map.description')}
          </p>
        </div>
        <UniversityMapCanvas
          universities={universities}
          isLoading={isLoading}
          isError={isError}
          mapRef={mapRef}
          onReady={syncCamera}
          onClusterZoom={syncClusterProgress}
        />
      </div>
    </section>
  );
}
