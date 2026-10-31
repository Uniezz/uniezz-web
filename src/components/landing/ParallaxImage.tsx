import { type ComponentProps } from 'react';
import { cn } from '@/ui/cn';

// Fills its parent; CSS scroll timelines handle parallax without a per-frame React update.
export const ParallaxImage = ({ className, ...props }: ComponentProps<'img'>) => {
  return (
    <div className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105">
      <img
        alt=""
        className={cn('landing-parallax-image size-full object-cover', className)}
        {...props}
      />
    </div>
  );
};
