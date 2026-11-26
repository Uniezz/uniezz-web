import { cva } from 'class-variance-authority';

// Spacing between rows is padding, because Virtuoso does not measure margins.
export const messageRowStyles = cva('flex w-full min-w-0 flex-col', {
  variants: {
    align: { start: 'items-start', end: 'items-end' },
    position: { single: 'pb-4', first: 'pb-1', middle: 'pb-1', last: 'pb-4' },
  },
});

export const bubbleStyles = cva(
  'flex w-fit max-w-[80%] min-w-0 flex-col gap-1 rounded-story border px-3.5 py-2.5 text-body leading-[1.4] wrap-break-word whitespace-pre-wrap text-white',
  {
    variants: {
      variant: { in: 'border-white-10 bg-white-10', out: 'border-transparent bg-blue' },
      tail: { true: '', false: '' },
    },
    compoundVariants: [
      { variant: 'in', tail: true, className: 'rounded-bl-[6px]' },
      { variant: 'out', tail: true, className: 'rounded-br-[6px]' },
    ],
  },
);

export const bubbleMetaStyles = cva('flex items-center gap-1 text-caption', {
  variants: { variant: { in: 'text-secondary', out: 'justify-end text-white-80' } },
});

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
      chip: 'pt-2 pb-6 font-semibold text-white-80',
      divider:
        'gap-3 pb-4 font-semibold text-sky before:h-px before:flex-1 before:bg-blue-40 after:h-px after:flex-1 after:bg-blue-40',
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
