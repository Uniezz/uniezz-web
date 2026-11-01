import { cva } from 'class-variance-authority';

// The cat on top, the message below it.
export const emptyStyles = cva(
  'relative isolate mx-auto my-6 w-full max-w-sm py-10 text-center text-body text-secondary',
);

// The night sky behind it: no border, wide faded edges so it melts into the page. Only this layer
// is masked, so the cat and text stay sharp.
export const emptySkyStyles = cva(
  'nav-item-active pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10 rounded-none border-0 [mask-image:linear-gradient(to_right,transparent,black_40%,black_60%,transparent),linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)] [mask-composite:intersect] after:hidden',
);
