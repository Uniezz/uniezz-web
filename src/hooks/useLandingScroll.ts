import { useScroll } from '@react-spring/web';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

export const landingMotionQuery = '(min-height: 640px) and (prefers-reduced-motion: no-preference)';

// React Spring tracks native scroll; section geometry determines the current scene.
export function useLandingScroll(
  steps = 1,
  onProgress?: (progress: number, isPinned: boolean) => void,
) {
  const ref = useRef<HTMLElement>(null);
  const updateRef = useRef<(() => void) | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  useScroll({ immediate: true, onChange: () => updateRef.current?.() });

  const reportProgress = useEffectEvent((progress: number, pinned: boolean) =>
    onProgress?.(progress, pinned),
  );

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const motion = matchMedia(landingMotionQuery);
    let previousProgress = -1;
    let previousPinned = false;
    // Geometry is measured on resize only: reading it on every scroll frame, after another
    // section wrote --progress, forced a layout per section per frame and made phones stutter.
    let sectionTop = 0;
    let distance = 0;
    const measure = () => {
      const stageHeight = section.firstElementChild?.clientHeight ?? window.innerHeight - 80;
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      distance = section.offsetHeight - stageHeight;
    };
    const update = () => {
      const top = sectionTop - window.scrollY;
      const progress =
        motion.matches && distance > 0 ? Math.min(1, Math.max(0, (80 - top) / distance)) : 0;
      section.style.setProperty('--progress', String(progress));
      if (progress !== previousProgress || motion.matches !== previousPinned) {
        reportProgress(progress, motion.matches);
        previousProgress = progress;
        previousPinned = motion.matches;
      }
      setActiveStep(Math.min(steps - 1, Math.floor(progress * steps)));
    };
    updateRef.current = update;
    const configure = () => {
      setIsPinned(motion.matches);
      measure();
      update();
    };
    const resize = new ResizeObserver(() => {
      measure();
      update();
    });
    resize.observe(section);
    // Content above the section (images, fonts) moves it without resizing it.
    resize.observe(document.body);
    if (section.firstElementChild) resize.observe(section.firstElementChild);
    configure();
    motion.addEventListener('change', configure);
    return () => {
      updateRef.current = null;
      resize.disconnect();
      motion.removeEventListener('change', configure);
    };
  }, [steps]);

  return { ref, activeStep, isPinned };
}
