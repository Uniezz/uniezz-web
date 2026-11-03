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
    const update = () => {
      const { top, height } = section.getBoundingClientRect();
      const stageHeight = section.firstElementChild?.clientHeight ?? window.innerHeight - 80;
      const distance = height - stageHeight;
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
      update();
    };
    const resize = new ResizeObserver(update);
    resize.observe(section);
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
