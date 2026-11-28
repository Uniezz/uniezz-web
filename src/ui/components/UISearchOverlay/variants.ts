import { cva } from 'class-variance-authority';

// above the bottom tabs and a sticky topbar, so search blurs the whole screen
export const searchOverlayStyles = cva('fixed inset-0 z-50 bg-ink-40 backdrop-blur-md lg:hidden');

// pinned to the bottom; `interactive-widget=resizes-content` lifts it above the keyboard
export const searchOverlayBarStyles = cva(
  'absolute inset-x-4 bottom-[max(8px,env(safe-area-inset-bottom))] flex h-11 items-center gap-2.5 rounded-full border border-white-10 bg-surface-60 pr-1.75 pl-3.5 backdrop-blur-xl',
);

export const searchOverlaySubmitStyles = cva(
  'flex size-7.5 shrink-0 items-center justify-center rounded-full bg-white text-ink focus-visible:ring-2 focus-visible:ring-blue',
);
