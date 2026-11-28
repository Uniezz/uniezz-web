import { cva } from 'class-variance-authority';

// Spacing between rows is padding, because Virtuoso does not measure margins.
export const messageRowStyles = cva('flex w-full min-w-0 flex-col', {
  variants: {
    align: { start: 'items-start', end: 'items-end' },
    // On a phone, every message is 6px apart, as in the app.
    position: {
      single: 'pb-3 max-lg:pb-1.5',
      first: 'pb-0.5 max-lg:pb-1.5',
      middle: 'pb-0.5 max-lg:pb-1.5',
      last: 'pb-3 max-lg:pb-1.5',
    },
  },
});

export const bubbleStyles = cva(
  // On a phone, the app's bubble: 260px wide at most, 16px corners without a tail.
  'flex w-fit max-w-[80%] min-w-0 flex-col gap-1 rounded-story border px-3.5 py-2.5 text-body leading-[1.4] wrap-break-word whitespace-pre-wrap text-white max-lg:max-w-[260px] max-lg:gap-0.5 max-lg:rounded-2xl max-lg:pb-2',
  {
    variants: {
      variant: {
        in: 'border-white-10 bg-white-10 max-lg:bg-surface-60',
        out: 'border-transparent bg-blue',
      },
      tail: { true: '', false: '' },
    },
    compoundVariants: [
      { variant: 'in', tail: true, className: 'rounded-bl-[6px] max-lg:rounded-bl-2xl' },
      { variant: 'out', tail: true, className: 'rounded-br-[6px] max-lg:rounded-br-2xl' },
    ],
  },
);

export const bubbleMetaStyles = cva(
  'flex items-center gap-1 text-caption max-lg:self-end max-lg:text-micro',
  {
    variants: {
      variant: {
        in: 'text-secondary max-lg:text-white-40',
        out: 'justify-end text-white-80 max-lg:text-white-60',
      },
    },
  },
);

export const reactionStyles = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-semibold text-white transition-[color,background-color,scale] focus-visible:outline-2 focus-visible:outline-blue motion-safe:animate-pop-in motion-safe:active:scale-[0.97]',
  {
    variants: {
      selected: {
        true: 'border-blue bg-blue-20',
        false: 'border-white-10 bg-white-10 hover:bg-white-20',
      },
    },
  },
);

export const markerStyles = cva('flex w-full min-w-0 items-center justify-center text-micro', {
  variants: {
    variant: {
      chip: 'pt-3 pb-6 font-semibold text-white-80 max-lg:pt-1 max-lg:pb-2 max-lg:font-medium max-lg:text-secondary',
      divider:
        'gap-3 pb-3 font-semibold text-sky before:h-px before:flex-1 before:bg-blue-40 after:h-px after:flex-1 after:bg-blue-40',
      note: 'pb-3 text-center text-secondary',
    },
  },
});

export const attachmentCardStyles = cva(
  'flex w-52 max-w-full min-w-0 items-center gap-2.5 rounded-xl border bg-white-10 p-2',
  {
    variants: {
      state: {
        uploading: 'border-transparent',
        done: 'border-transparent',
        error: 'border-danger',
      },
    },
  },
);
