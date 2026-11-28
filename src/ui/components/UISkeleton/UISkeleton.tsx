import { cn } from '../../cn';

export type UISkeletonProps = {
  /** Size and shape, e.g. `h-4 w-32` or `size-10 rounded-full`. */
  className?: string;
};

/** A loading placeholder, as the mobile app's UISkeleton: white 10%, radius 16, pulsing unless motion is reduced. */
export function UISkeleton({ className }: UISkeletonProps) {
  return (
    <span
      aria-hidden
      className={cn('block rounded-2xl bg-white-10 motion-safe:animate-pulse', className)}
    />
  );
}
