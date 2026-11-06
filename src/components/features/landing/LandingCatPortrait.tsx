import { useInView, useReducedMotion } from '@react-spring/web';
import { CatchBoundary } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const LandingCatCanvas = lazy(() =>
  import('./LandingCatCanvas').then((module) => ({ default: module.LandingCatCanvas })),
);

export function LandingCatPortrait() {
  const [ref, inView] = useInView();
  const reducedMotion = useReducedMotion();
  const fallback = <img src="/app/sidebar-cat.png" alt="" loading="lazy" />;
  return (
    <div ref={ref} className="landing-unicat-portrait" aria-hidden>
      {reducedMotion && fallback}
      {reducedMotion === false && (
        <CatchBoundary getResetKey={() => 'landing-cat'} errorComponent={() => fallback}>
          <Suspense fallback={null}>
            <LandingCatCanvas isVisible={inView} />
          </Suspense>
        </CatchBoundary>
      )}
    </div>
  );
}
