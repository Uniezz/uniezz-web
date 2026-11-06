import { useInView, useReducedMotion } from '@react-spring/web';
import { CatchBoundary } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const LandingCatCanvas = lazy(() =>
  import('./LandingCatCanvas').then((module) => ({ default: module.LandingCatCanvas })),
);

export function LandingCatPortrait() {
  const [ref, inView] = useInView();
  const reducedMotion = useReducedMotion();
  return (
    <div ref={ref} className="landing-unicat-portrait" aria-hidden>
      <img src="/app/sidebar-cat.png" alt="" loading="lazy" />
      {inView && reducedMotion === false && (
        <CatchBoundary getResetKey={() => 'landing-cat'} errorComponent={() => null}>
          <Suspense fallback={null}>
            <LandingCatCanvas />
          </Suspense>
        </CatchBoundary>
      )}
    </div>
  );
}
