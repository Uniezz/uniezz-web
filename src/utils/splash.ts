import type { AnyRouter } from '@tanstack/react-router';

// Caps the wait so one slow image never keeps a student on the splash.
const MAX_WAIT_MS = 4000;
// One full shine sweep (200 ms delay + 900 ms), as in the mobile splash, so it never just flashes.
const MIN_SHOW_MS = 1100;
const LAND_MS = 700;
const FADE_MS = 400;
// Geometry from uniezz-mobile utils/splash.ts: the U inside the 1024 px splash png,
// and where the blurred U sits in the backdrop, as fractions of the backdrop width.
const LOGO_WIDTH = 484 / 1024;
const LOGO_OFFSET_Y = (271 + 507 / 2 - 512) / 1024;
const LANDED_WIDTH = 0.484;
const LANDED_CENTER_Y = 0.42;

/** Scales and moves the logo onto the backdrop's blurred U, as the mobile splash does. */
export function landTransform(viewportWidth: number, viewportHeight: number) {
  const logoSize = Math.min(390, viewportWidth);
  const backdropWidth = Math.min(600, viewportWidth);
  const scale = (LANDED_WIDTH * backdropWidth) / (LOGO_WIDTH * logoSize);
  const y = LANDED_CENTER_Y * backdropWidth - viewportHeight / 2 - scale * LOGO_OFFSET_Y * logoSize;
  return `translateY(${y}px) scale(${scale})`;
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/** Removes the index.html splash once the first page, its fonts and its eager images are ready. */
export async function hideSplashWhenReady(router: AnyRouter) {
  const splash = document.getElementById('splash');
  if (!splash) return;

  const ready = (async () => {
    if (router.state.status !== 'idle' || router.state.isLoading) {
      await new Promise<void>((resolve) => {
        const unsubscribe = router.subscribe('onResolved', () => {
          unsubscribe();
          resolve();
        });
      });
    }
    // Let React paint the route, so its fonts are requested and its images are in the DOM.
    await nextFrame();
    await nextFrame();
    const images = [...document.images].filter((image) => image.loading !== 'lazy');
    await Promise.all([
      document.fonts.ready,
      ...images.map((image) => image.decode().catch(() => undefined)),
    ]);
  })();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  await Promise.all([Promise.race([ready, sleep(MAX_WAIT_MS)]), sleep(MIN_SHOW_MS)]);
  splash.style.setProperty('--splash-land', landTransform(innerWidth, innerHeight));
  splash.dataset.landing = 'true';
  await sleep(LAND_MS);
  splash.dataset.hidden = 'true';
  await sleep(FADE_MS);
  splash.remove();
}
