import { cva } from 'class-variance-authority';

export const sidebarStyles = cva(
  'flex w-66 shrink-0 flex-col bg-dark-blue bg-[radial-gradient(ellipse_170%_65%_at_8%_5%,color-mix(in_srgb,var(--color-blue-light)_40%,transparent)_0%,transparent_100%),radial-gradient(ellipse_150%_55%_at_90%_96%,color-mix(in_srgb,var(--color-accent)_24%,transparent)_0%,transparent_100%)] px-4 py-5',
);

export const sidebarMarkStyles = cva(
  'flex size-8.5 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,var(--color-blue-light)_0%,var(--color-blue)_100%)]',
);

export const sidebarCaptionStyles = cva(
  'text-caption font-bold tracking-[0.8px] text-navy-caption',
);
