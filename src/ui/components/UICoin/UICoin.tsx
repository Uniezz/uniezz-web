import { cn } from '../../cn';

/** `size` in px, for slots that size icons by number (navigation). */
export type UICoinProps = { className?: string; size?: number };

/** The Uniezz coin; decorative, so pair it with a text label. */
export const UICoin = ({ className, size }: UICoinProps) => (
  <img
    src="/app/coin.png"
    alt=""
    aria-hidden="true"
    style={size ? { width: size, height: size } : undefined}
    className={cn('size-4 shrink-0 rounded-full', className)}
  />
);
