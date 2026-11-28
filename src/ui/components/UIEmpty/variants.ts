import { cva } from 'class-variance-authority';

// The cat on top, the message below it.
// On a phone, the mobile app's UIEmpty: cat and message 12 apart, 24 padding.
export const emptyStyles = cva(
  'relative isolate mx-auto my-6 w-full max-w-sm py-10 text-center text-body text-secondary max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-3 max-lg:p-6 max-lg:[&>div:last-child]:p-0',
  {
    variants: {
      isScreenCentred: {
        true: 'max-lg:pointer-events-none max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:bottom-(--bottom-tabs-height) max-lg:my-0 max-lg:max-w-none max-lg:justify-center max-lg:[&>*]:pointer-events-auto',
        false: '',
      },
    },
    defaultVariants: { isScreenCentred: false },
  },
);

// The night sky behind it: no border, wide faded edges so it melts into the page. Only this layer
// is masked, so the cat and text stay sharp.
// The phone shows only the cat and the message, as the mobile app.
export const emptySkyStyles = cva(
  'nav-item-active pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10 rounded-none border-0 [mask-image:linear-gradient(to_right,transparent,black_40%,black_60%,transparent),linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)] [mask-composite:intersect] after:hidden max-lg:hidden',
);
