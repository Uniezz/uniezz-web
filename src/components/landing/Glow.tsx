import { motion } from 'motion/react';
import { cn } from '@/ui/cn';

// Soft colored light drifting slowly behind a section. Position and color come from className.
export const Glow = ({ className }: { className?: string }) => (
  <motion.div
    aria-hidden
    className={cn('pointer-events-none absolute size-[42vw] rounded-full blur-[120px]', className)}
    animate={{ x: ['-8%', '10%', '-8%'], y: ['0%', '12%', '0%'] }}
    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
  />
);
