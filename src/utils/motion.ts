import { type MotionProps } from 'motion/react';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const once = { once: true, amount: 0.25 };

export const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: once,
  transition: { duration: 0.9, ease: EASE_OUT, delay },
});

// Watches the viewport for its children, which animate through `variants`. Needed when
// children start clipped: a fully clipped element never reports as in view.
export const inViewGroup: MotionProps = { initial: 'hidden', whileInView: 'shown', viewport: once };

export const wipeUp = (delay = 0): MotionProps => ({
  variants: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
    shown: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.2, ease: EASE_OUT, delay } },
  },
});

export const riseIn = (delay = 0): MotionProps => ({
  variants: {
    hidden: { opacity: 0, y: 28 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay } },
  },
});

export const drawLine = (delay = 0): MotionProps => ({
  initial: { scaleX: 0 },
  whileInView: { scaleX: 1 },
  viewport: once,
  transition: { duration: 1, ease: EASE_OUT, delay },
});
