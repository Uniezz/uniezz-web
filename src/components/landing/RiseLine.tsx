import { motion } from 'motion/react';
import { type ReactNode } from 'react';
import { cn } from '@/ui/cn';
import { EASE_OUT } from '@/utils';

type RiseLineProps = { children: ReactNode; delay?: number; className?: string };

// Slides text up from behind a mask. The outer span observes the viewport because the
// inner one starts clipped, and a clipped element never counts as intersecting.
export const RiseLine = ({ children, delay = 0, className }: RiseLineProps) => (
  <motion.span
    initial="hidden"
    whileInView="shown"
    viewport={{ once: true }}
    className={cn(
      '-mx-[0.1em] -mb-[0.15em] block overflow-hidden px-[0.1em] pb-[0.15em]',
      className,
    )}
  >
    <motion.span
      className="block"
      variants={{
        hidden: { y: '110%' },
        shown: { y: '0%', transition: { duration: 1.1, ease: EASE_OUT, delay } },
      }}
    >
      {children}
    </motion.span>
  </motion.span>
);
