import { useReducedMotion } from '@react-spring/web';

export function LandingCatPortrait() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="landing-unicat-portrait" aria-hidden>
      {reducedMotion && <img src="/app/sidebar-cat.png" alt="" loading="lazy" />}
      {/* <object>, not <img>: each mount gets its own SMIL clock (see UIEmpty). */}
      {reducedMotion === false && (
        <object data="/app/empty-cat.svg" type="image/svg+xml" tabIndex={-1} />
      )}
    </div>
  );
}
