import { type ReactNode } from 'react';
import { animated, easings, useInView, useReducedMotion, useSpring } from '@react-spring/web';
import { useState } from 'react';
import { cn } from '@/ui/cn';

type RiseLineProps = { children: ReactNode; delay?: number; className?: string };

// Slides text up from behind a mask. The outer span observes the viewport because the
// inner one starts clipped, and a clipped element never counts as intersecting.
export const RiseLine = ({ children, delay = 0, className }: RiseLineProps) => {
  const [ref, inView] = useInView({ once: true });
  const reducedMotion = Boolean(useReducedMotion());
  const [finished, setFinished] = useState(false);
  const style = useSpring({
    from: { y: reducedMotion ? '0%' : '110%' },
    to: { y: inView ? '0%' : '110%' },
    delay: reducedMotion ? 0 : delay * 1000,
    immediate: reducedMotion,
    config: { duration: 1100, easing: easings.easeOutQuart },
    onRest: () => setFinished(true),
  });

  return (
    <span
      ref={ref}
      className={cn(
        '-mx-[0.1em] -mb-[0.15em] block overflow-hidden px-[0.1em] pb-[0.15em]',
        className,
      )}
    >
      <animated.span style={finished ? undefined : style} className="block">
        {children}
      </animated.span>
    </span>
  );
};
