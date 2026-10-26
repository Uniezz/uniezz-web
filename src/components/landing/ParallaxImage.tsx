import { type HTMLMotionProps, motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/ui/cn';

// Fills its positioned parent, drifts slower than the page and zooms in on parent `group` hover.
export const ParallaxImage = ({ className, ...props }: HTMLMotionProps<'img'>) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105"
    >
      <motion.img
        alt=""
        style={{ y, scale: 1.16 }}
        className={cn('size-full object-cover', className)}
        {...props}
      />
    </div>
  );
};
