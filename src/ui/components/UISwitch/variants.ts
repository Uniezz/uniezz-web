import { cva } from 'class-variance-authority';

export const switchRowStyles = cva('flex items-center justify-between gap-4');

export const switchLabelStyles = cva('text-detail font-semibold');

export const switchThumbStyles = cva('size-4 rounded-full bg-white');

export const switchStyles = cva(
  'flex h-5.5 w-9.5 shrink-0 items-center rounded-full p-0.75 focus-visible:outline-2 focus-visible:outline-white',
  {
    variants: { checked: { true: 'justify-end bg-blue', false: 'bg-white-20' } },
    defaultVariants: { checked: false },
  },
);
