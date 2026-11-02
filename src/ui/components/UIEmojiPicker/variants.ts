import { cva } from 'class-variance-authority';

export const emojiPickerStyles = cva(
  'absolute bottom-full z-20 mb-2 flex h-80 w-72 flex-col gap-2 rounded-2xl border border-white-10 bg-surface-60 p-2 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-[48px]',
  { variants: { align: { start: 'left-0', end: 'right-0' } }, defaultVariants: { align: 'end' } },
);

export const emojiSearchStyles = cva(
  'h-9 rounded-xl border border-white-10 bg-white-5 px-3 text-label text-white outline-none placeholder:text-secondary focus:border-white-60',
);

export const emojiStyles = cva(
  'grid size-8 place-items-center rounded-lg text-xl data-active:bg-white-10',
);
