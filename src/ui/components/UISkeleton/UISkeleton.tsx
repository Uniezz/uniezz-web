import type { ComponentProps } from 'react';
import { cn } from '@/ui/cn';

export type UISkeletonProps = ComponentProps<'div'>;

export function UISkeleton({ className, ...props }: UISkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-white-20', className)}
      {...props}
    />
  );
}
